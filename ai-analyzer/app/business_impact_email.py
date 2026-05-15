from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage

from fastapi import HTTPException

from .business_impact_models import BusinessImpactResponse


def _build_email_body(result: BusinessImpactResponse) -> str:
    lines: list[str] = []
    lines.append(f"Business: {result.business}")
    lines.append(f"Industry: {result.industry}")
    lines.append(f"Location: {result.location}")
    if result.geographies:
        lines.append(f"Geographies: {', '.join(result.geographies)}")
    if result.operations_geographies:
        lines.append(f"Operations Geographies: {', '.join(result.operations_geographies)}")

    lines.append("")
    lines.append("Executive Summary")
    lines.append(result.report.executive_summary)
    lines.append("")
    lines.append(
        f"Sentiment Overview: +{result.sentiment_overview.positive} / -{result.sentiment_overview.negative} / ={result.sentiment_overview.neutral}"
    )
    lines.append(
        f"Average Sentiment Score: {result.sentiment_overview.average_sentiment_score} | Average Impact Score: {result.sentiment_overview.average_impact_score}"
    )
    lines.append("")

    def _section(name: str, items: list) -> None:
        lines.append(name)
        if not items:
            lines.append("- None")
            lines.append("")
            return
        for item in items:
            signal_ids = ", ".join(item.signal_ids) if item.signal_ids else "No signal refs"
            lines.append(f"- {item.text} [{signal_ids}]")
        lines.append("")

    _section("Key Signals", result.report.key_signals)
    _section("Risks", result.report.risks)
    _section("Opportunities", result.report.opportunities)
    _section("Compliance Impact", result.report.compliance_impact)
    _section("Recommended Actions", result.report.recommended_actions)

    lines.append(f"Urgency Level: {result.report.urgency_level}")
    lines.append(f"Confidence: {result.report.confidence}")
    lines.append(f"Data Quality: {result.report.data_quality}")
    lines.append("")
    lines.append("Final Recommendation")
    lines.append(result.report.final_recommendation)
    lines.append("")
    lines.append(result.report.disclaimer)

    if result.signals_found:
        lines.append("")
        lines.append("Sources")
        for sig in result.signals_found:
            lines.append(f"- {sig.id}: {sig.title} ({sig.source})")
            lines.append(f"  {sig.url}")

    return "\n".join(lines)


def send_business_impact_email(recipient_email: str, result: BusinessImpactResponse) -> None:
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM") or smtp_user

    if not smtp_user or not smtp_password or not smtp_from:
        raise HTTPException(
            status_code=503,
            detail="SMTP credentials missing. Set SMTP_USER, SMTP_PASSWORD, SMTP_FROM",
        )

    subject = f"[{result.report.urgency_level}] Daily Business Impact Report - {result.business}"

    message = EmailMessage()
    message["From"] = smtp_from
    message["To"] = recipient_email
    message["Subject"] = subject
    message.set_content(_build_email_body(result))

    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(message)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Email send failed: {exc}") from exc
