"""Fetchers for RegIntel sources: Stellar, Etherscan, CoinGecko, regulatory feeds, sanctions."""
from __future__ import annotations

import hashlib
import re
import os
from datetime import datetime, timezone
from typing import Any
import xml.etree.ElementTree as ET

import httpx

# Optional: feedparser for RSS (install if not present)
try:
    import feedparser
except ImportError:
    feedparser = None  # type: ignore

HORIZON_URL = "https://horizon.stellar.org"
STELLAR_EXPERT_API = "https://api.stellar.expert"
ETHERSCAN_API = "https://api.etherscan.io"
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Regulatory RSS / list pages (free, no key)
REGULATORY_SOURCES = [
    {"name": "FCA", "url": "https://www.fca.org.uk/news/rss", "jurisdiction": "UK"},
    {"name": "MAS", "url": "https://www.mas.gov.sg/rss", "jurisdiction": "SG"},
    {"name": "ESMA", "url": "https://www.esma.europa.eu/rss/news", "jurisdiction": "EU"},
    {"name": "FinCEN", "url": "https://www.fincen.gov/rss.xml", "jurisdiction": "US"},
    {"name": "VARA", "url": "https://www.vara.ae/en/news", "jurisdiction": "UAE"},  # HTML
    {"name": "OFAC", "url": "https://www.treasury.gov/ofac/downloads/sdn.xml", "jurisdiction": "US"},
]

# OFAC SDN list (XML) - summary doc
OFAC_SDN_URL = "https://www.treasury.gov/ofac/downloads/sdn.xml"


def _hash_content(raw: str, url: str) -> str:
    return hashlib.sha256((raw + url).encode()).hexdigest()


def _html_to_text(html: str, max_len: int = 50000) -> str:
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=re.I)
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:max_len]


def _date_parse(s: str | None) -> datetime | None:
    if not s:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S%z", "%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%d"):
        try:
            return datetime.strptime(s.replace("Z", "+00:00")[:26], fmt[:20] if "T" in fmt else fmt)
        except Exception:
            continue
    return None


async def fetch_stellar_horizon(wallet_addresses: list[str] | None = None) -> list[dict[str, Any]]:
    """Ingest Stellar network/account activity. If wallet_addresses given, fetch payments for those."""
    out: list[dict[str, Any]] = []
    async with httpx.AsyncClient(timeout=30.0) as client:
        if wallet_addresses:
            for addr in wallet_addresses[:5]:
                try:
                    r = await client.get(
                        f"{HORIZON_URL}/accounts/{addr}/payments?limit=20&order=desc"
                    )
                    if r.status_code != 200:
                        continue
                    data = r.json()
                    records = data.get("_embedded", {}).get("records", [])
                    for rec in records:
                        created = rec.get("created_at", "")[:19].replace("T", " ")
                        amount = rec.get("amount", "0")
                        asset = rec.get("asset_type", "native")
                        from_a = rec.get("from", "")[:8]
                        to_a = rec.get("to", "")[:8]
                        tx_hash = rec.get("transaction_hash", "")
                        title = f"Stellar payment {amount} ({asset})"
                        raw = f"Stellar payment. From {from_a}... To {to_a}... Amount {amount} {asset}. Tx: {tx_hash}. Created {created}."
                        url = f"https://stellar.expert/explorer/public/tx/{tx_hash}" if tx_hash else HORIZON_URL
                        out.append({
                            "title": title,
                            "url": url,
                            "published_at": _date_parse(rec.get("created_at")),
                            "raw_text": raw,
                            "jurisdiction": "global",
                            "doc_type": "activity",
                        })
                except Exception:
                    continue
        else:
            # Single "network summary" doc
            try:
                r = await client.get(f"{HORIZON_URL}/ledgers?limit=1&order=desc")
                if r.status_code == 200:
                    data = r.json()
                    recs = data.get("_embedded", {}).get("records", [])
                    if recs:
                        seq = recs[0].get("sequence", 0)
                        closed = recs[0].get("closed_at", "")
                        raw = f"Stellar network ledger sequence {seq}. Closed at {closed}. Use for compliance context."
                        out.append({
                            "title": "Stellar network ledger summary",
                            "url": HORIZON_URL,
                            "published_at": _date_parse(closed),
                            "raw_text": raw,
                            "jurisdiction": "global",
                            "doc_type": "api",
                        })
            except Exception:
                pass
    return out


async def fetch_stellar_expert(wallet_addresses: list[str] | None = None) -> list[dict[str, Any]]:
    """StellarExpert public API - account/asset info."""
    out: list[dict[str, Any]] = []
    async with httpx.AsyncClient(timeout=30.0) as client:
        if wallet_addresses:
            for addr in wallet_addresses[:3]:
                try:
                    r = await client.get(
                        f"{STELLAR_EXPERT_API}/explorer/public/account/{addr}"
                    )
                    if r.status_code != 200:
                        continue
                    data = r.json()
                    name = data.get("name") or addr[:8]
                    raw = f"StellarExpert account: {name}. Address: {addr}. Use for wallet context in compliance."
                    out.append({
                        "title": f"StellarExpert account {name}",
                        "url": f"https://stellar.expert/explorer/public/account/{addr}",
                        "published_at": None,
                        "raw_text": raw,
                        "jurisdiction": "global",
                        "doc_type": "api",
                    })
                except Exception:
                    continue
        else:
            out.append({
                "title": "StellarExpert API reference",
                "url": STELLAR_EXPERT_API,
                "published_at": None,
                "raw_text": "StellarExpert provides public API for Stellar accounts and assets. Use for web3 compliance context.",
                "jurisdiction": "global",
                "doc_type": "api",
            })
    return out


async def fetch_etherscan(api_key: str, addresses: list[str]) -> list[dict[str, Any]]:
    """Etherscan: recent txs and token transfers for given EVM addresses."""
    out: list[dict[str, Any]] = []
    if not api_key or not addresses:
        return out
    async with httpx.AsyncClient(timeout=30.0) as client:
        for addr in addresses[:3]:
            try:
                r = await client.get(
                    ETHERSCAN_API,
                    params={"module": "account", "action": "txlist", "address": addr, "apikey": api_key, "limit": 10},
                )
                if r.status_code != 200:
                    continue
                data = r.json()
                if data.get("status") != "1":
                    continue
                for tx in data.get("result", [])[:10]:
                    raw = f"EVM tx: from {tx.get('from','')[:10]} to {tx.get('to','')[:10]}. Value {tx.get('value',0)} wei. Hash {tx.get('hash','')}."
                    ts = tx.get("timeStamp")
                    if isinstance(ts, (int, float)):
                        published_at = datetime.fromtimestamp(int(ts), tz=timezone.utc)
                    else:
                        published_at = _date_parse(str(ts))
                    out.append({
                        "title": "EVM transaction",
                        "url": f"https://etherscan.io/tx/{tx.get('hash','')}",
                        "published_at": published_at,
                        "raw_text": raw,
                        "jurisdiction": "global",
                        "doc_type": "activity",
                    })
            except Exception:
                continue
    return out


async def fetch_coingecko() -> list[dict[str, Any]]:
    """CoinGecko global defi/market context (free, no key)."""
    out: list[dict[str, Any]] = []
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.get(f"{COINGECKO_BASE}/global/decentralized_finance_defi")
            if r.status_code != 200:
                return out
            data = r.json().get("data", {})
            raw = f"DeFi market: total value locked {data.get('total_value_locked_btc', 0)} BTC. Eth market cap dominance {data.get('eth_market_cap_dominance', 0)}. Use for web3 compliance context."
            out.append({
                "title": "CoinGecko DeFi market summary",
                "url": "https://www.coingecko.com/en/global-charts",
                "published_at": datetime.now(timezone.utc),
                "raw_text": raw,
                "jurisdiction": "global",
                "doc_type": "api",
            })
        except Exception:
            pass
    return out


async def fetch_rss(url: str, jurisdiction: str, name: str) -> list[dict[str, Any]]:
    """Fetch RSS feed and return list of doc dicts."""
    out: list[dict[str, Any]] = []
    if not feedparser:
        return out
    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            r = await client.get(url)
            if r.status_code != 200:
                return out
            feed = feedparser.parse(r.text)
            for e in feed.entries[:30]:
                title = e.get("title", "No title")
                link = e.get("link", url)
                summary = e.get("summary", e.get("description", ""))
                raw = _html_to_text(summary, 8000) or title
                pub = e.get("published_parsed")
                if pub:
                    import time
                    dt = datetime.fromtimestamp(time.mktime(pub), tz=timezone.utc)
                    published_at = dt
                else:
                    published_at = None
                out.append({
                    "title": title,
                    "url": link,
                    "published_at": published_at,
                    "raw_text": raw[:50000],
                    "jurisdiction": jurisdiction,
                    "doc_type": "rss",
                })
        except Exception:
            pass
    return out


async def fetch_ofac_sdn() -> list[dict[str, Any]]:
    """OFAC SDN list (XML) - one summary document."""
    out: list[dict[str, Any]] = []
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            r = await client.get(OFAC_SDN_URL)
            if r.status_code != 200:
                return out
            root = ET.fromstring(r.text)
            ns = {"ofac": "http://tempuri.org/sdnList.xsd"}
            entries = root.findall(".//ofac:sdnEntry", ns) or root.findall(".//sdnEntry")
            count = len(entries)
            raw = f"OFAC SDN list: {count} entries. Source: {OFAC_SDN_URL}. Sanctions screening required for web3/crypto compliance. Use for mandatory controls: Sanctions Screening."
            out.append({
                "title": "OFAC SDN list summary",
                "url": "https://www.treasury.gov/ofac/downloads/sdn.xml",
                "published_at": datetime.now(timezone.utc),
                "raw_text": raw,
                "jurisdiction": "US",
                "doc_type": "dataset",
            })
        except Exception:
            pass
    return out


async def fetch_html_list_page(url: str, jurisdiction: str, name: str) -> list[dict[str, Any]]:
    """Scrape a simple list page (e.g. VARA news) - extract titles and links."""
    out: list[dict[str, Any]] = []
    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            r = await client.get(url)
            if r.status_code != 200:
                return out
            text = _html_to_text(r.text, 30000)
            if len(text) < 200:
                return out
            out.append({
                "title": f"{name} regulatory updates",
                "url": url,
                "published_at": None,
                "raw_text": text[:50000],
                "jurisdiction": jurisdiction,
                "doc_type": "html",
            })
        except Exception:
            pass
    return out


async def fetch_source(source: dict[str, Any], wallet_stellar: list[str], wallet_evm: list[str]) -> list[dict[str, Any]]:
    """Dispatch to the right fetcher by source type and name/url."""
    stype = source.get("type", "")
    url = (source.get("url") or "").strip()
    name = (source.get("name") or "").strip()
    jurisdiction = source.get("jurisdiction")

    if stype == "api":
        if "stellar.org" in url or "Stellar Horizon" in name:
            return await fetch_stellar_horizon(wallet_stellar or None)
        if "stellar.expert" in url or "StellarExpert" in name:
            return await fetch_stellar_expert(wallet_stellar or None)
        if "etherscan" in url or "Etherscan" in name:
            api_key = os.getenv("ETHERSCAN_API_KEY", "").strip()
            return await fetch_etherscan(api_key, wallet_evm or [])
        if "coingecko" in url or "CoinGecko" in name:
            return await fetch_coingecko()
    if stype == "rss":
        return await fetch_rss(url, jurisdiction or "global", name)
    if stype == "dataset":
        if "ofac" in url.lower() or "OFAC" in name:
            return await fetch_ofac_sdn()
    if stype == "html":
        return await fetch_html_list_page(url, jurisdiction or "global", name)

    return []
