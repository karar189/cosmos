from __future__ import annotations

import os
import time
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import HTTPException
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from .business_impact_models import BusinessImpactProfile, MarketSignal, SentimentOverview


NEWS_API_BASE = "https://newsapi.org/v2/everything"

# Simple in-memory cache (ttl = 30 minutes)
_cache: dict[str, tuple[float, object]] = {}
CACHE_TTL_SECONDS = 1800

vader = SentimentIntensityAnalyzer()


CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "Compliance Alert": [
        "regulation",
        "regulatory",
        "compliance",
        "license",
        "licensing",
        "sanction",
        "court",
        "lawsuit",
        "ofac",
        "fincen",
        "mas",
        "mica",
    ],
    "Market Trend": [
        "market",
        "growth",
        "decline",
        "demand",
        "adoption",
        "trend",
        "forecast",
    ],
    "Financial Impact": [
        "funding",
        "revenue",
        "pricing",
        "volume",
        "profit",
        "cost",
        "loss",
        "liquidity",
    ],
    "Operational Impact": [
        "outage",
        "incident",
        "breach",
        "integration",
        "deployment",
        "infrastructure",
        "security",
        "downtime",
    ],
    "Technology": [
        "api",
        "blockchain",
        "wallet",
        "stablecoin",
        "protocol",
        "payments",
        "cross-border",
        "sdk",
    ],
}


HIGH_IMPACT_WORDS = {
    "ban",
    "penalty",
    "lawsuit",
    "hack",
    "breach",
    "freeze",
    "sanction",
    "approved",
    "rejected",
    "surge",
    "crash",
    "record",
}

CREDIBLE_SOURCES = {
    "reuters",
    "bloomberg",
    "ft",
    "financial times",
    "wsj",
    "cnbc",
    "coindesk",
    "the block",
    "cointelegraph",
}


def _cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.monotonic() - entry[0]) < CACHE_TTL_SECONDS:
        return entry[1]
    return None


def _cache_set(key: str, value: object) -> None:
    _cache[key] = (time.monotonic(), value)


def _classify_category(text: str) -> str:
    lowered = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in lowered for keyword in keywords):
            return category
    return "Market Trend"


def _sentiment_from_text(title: str, summary: str) -> tuple[str, float]:
    score = vader.polarity_scores(f"{title} {summary}").get("compound", 0.0)
    if score >= 0.05:
        return "up", round(score, 3)
    if score <= -0.05:
        return "down", round(score, 3)
    return "neutral", round(score, 3)


def _impact_score(title: str, summary: str, source: str) -> float:
    text = f"{title} {summary}".lower()
    sentiment_intensity = abs(vader.polarity_scores(text).get("compound", 0.0))
    base = 4.0 + (sentiment_intensity * 4.0)

    if any(word in text for word in HIGH_IMPACT_WORDS):
        base = min(10.0, base + 1.0)

    source_lower = (source or "").lower()
    if any(cred in source_lower for cred in CREDIBLE_SOURCES):
        base = min(10.0, base + 0.5)

    return round(max(1.0, min(10.0, base)), 1)


def build_search_queries(profile: BusinessImpactProfile) -> list[str]:
    geos = list(dict.fromkeys([profile.location, *profile.geographies, *profile.operations_geographies]))
    focus = [f.strip() for f in profile.risk_focus if f and f.strip()][:5]
    focus_terms = focus or ["regulation", "compliance", "payments", "stablecoin"]
    industry = profile.industry.strip()
    queries: list[str] = []

    for geo in geos[:3]:
        queries.append(
            f'("{industry}" OR fintech OR "cross-border payments" OR stablecoin) '
            f'AND ({geo}) AND (regulation OR compliance OR policy OR law)'
        )
        queries.append(
            f'("{industry}" OR fintech OR payments) '
            f'AND ({geo}) AND (market OR trend OR adoption OR growth)'
        )

    for term in focus_terms[:3]:
        queries.append(
            f'("{industry}" OR payments OR fintech) AND ({term})'
        )

    queries.append(f'"{profile.business_name}" OR "{industry}" news')
    queries.append("(stablecoin OR crypto payments OR cross-border payments) regulation")
    queries.append("(fintech OR payments infrastructure) compliance updates")

    # Preserve order and remove dupes
    unique_queries: list[str] = []
    seen: set[str] = set()
    for q in queries:
        normalized = q.strip().lower()
        if normalized and normalized not in seen:
            seen.add(normalized)
            unique_queries.append(q)

    return unique_queries[:8]


async def _fetch_news_api(query: str, lookback_hours: int, page_size: int = 6) -> list[dict]:
    api_key = os.getenv("NEWS_DATA_API_KEY") or os.getenv("NEWS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="NEWS_DATA_API_KEY is missing")

    now = datetime.now(timezone.utc)
    from_date = (now - timedelta(hours=lookback_hours)).strftime("%Y-%m-%dT%H:%M:%SZ")
    params = {
        "q": query,
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "from": from_date,
        "apiKey": api_key,
    }

    cache_key = str(sorted(params.items()))
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached  # type: ignore[return-value]

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(NEWS_API_BASE, params=params)

    if resp.status_code != 200:
        detail = "News API request failed"
        try:
            detail = resp.json().get("message", detail)
        except Exception:
            pass
        raise HTTPException(status_code=resp.status_code, detail=detail)

    payload = resp.json()
    articles = payload.get("articles", [])
    _cache_set(cache_key, articles)
    return articles


async def fetch_market_signals(
    profile: BusinessImpactProfile,
    *,
    lookback_hours: int = 24,
    max_signals: int = 10,
) -> list[MarketSignal]:
    queries = build_search_queries(profile)
    seen_urls: set[str] = set()
    signals: list[MarketSignal] = []

    async def _collect(query_list: list[str]) -> None:
        for query in query_list:
            articles = await _fetch_news_api(query, lookback_hours=lookback_hours, page_size=8)
            for item in articles:
                title = (item.get("title") or "").strip()
                url = (item.get("url") or "").strip()
                if not title or not url or url in seen_urls:
                    continue

                seen_urls.add(url)
                summary = (item.get("description") or item.get("content") or "").strip()
                source = ((item.get("source") or {}).get("name") or "Unknown").strip()
                sentiment, score = _sentiment_from_text(title, summary)

                signals.append(
                    MarketSignal(
                        id=f"sig-{len(signals) + 1}",
                        title=title,
                        url=url,
                        source=source,
                        summary=summary,
                        published_date=item.get("publishedAt"),
                        sentiment=sentiment,
                        sentiment_score=score,
                        impact_score=_impact_score(title, summary, source),
                        category=_classify_category(f"{title} {summary}"),
                    )
                )

                if len(signals) >= max_signals:
                    return

    await _collect(queries)
    if len(signals) >= max_signals:
        return signals

    # Fallback query pack for sparse or niche industries.
    fallback_queries = [
        "(stablecoin OR crypto OR fintech) AND (regulation OR compliance)",
        "(payments OR payroll) AND (regulation OR sanctions OR aml)",
        "(cross-border payments) AND (market OR adoption OR policy)",
    ]
    await _collect(fallback_queries)
    if len(signals) >= max_signals:
        return signals

    # Last fallback: broaden recency window automatically.
    if not signals and lookback_hours < 168:
        await _collect(["(fintech OR payments OR stablecoin) AND (news OR update)"])
        if signals:
            return signals

    # Final attempt with 7-day lookback if still empty.
    if not signals:
        broad_lookback = 168
        for query in fallback_queries:
            articles = await _fetch_news_api(query, lookback_hours=broad_lookback, page_size=10)
            for item in articles:
                title = (item.get("title") or "").strip()
                url = (item.get("url") or "").strip()
                if not title or not url or url in seen_urls:
                    continue

                seen_urls.add(url)
                summary = (item.get("description") or item.get("content") or "").strip()
                source = ((item.get("source") or {}).get("name") or "Unknown").strip()
                sentiment, score = _sentiment_from_text(title, summary)

                signals.append(
                    MarketSignal(
                        id=f"sig-{len(signals) + 1}",
                        title=title,
                        url=url,
                        source=source,
                        summary=summary,
                        published_date=item.get("publishedAt"),
                        sentiment=sentiment,
                        sentiment_score=score,
                        impact_score=_impact_score(title, summary, source),
                        category=_classify_category(f"{title} {summary}"),
                    )
                )

                if len(signals) >= max_signals:
                    return signals

    return signals[:max_signals]


def summarize_sentiment(signals: list[MarketSignal]) -> SentimentOverview:
    if not signals:
        return SentimentOverview()

    positive = sum(1 for s in signals if s.sentiment == "up")
    negative = sum(1 for s in signals if s.sentiment == "down")
    neutral = sum(1 for s in signals if s.sentiment == "neutral")

    avg_sentiment = round(sum(s.sentiment_score for s in signals) / len(signals), 3)
    avg_impact = round(sum(s.impact_score for s in signals) / len(signals), 2)

    return SentimentOverview(
        positive=positive,
        negative=negative,
        neutral=neutral,
        average_sentiment_score=avg_sentiment,
        average_impact_score=avg_impact,
    )
