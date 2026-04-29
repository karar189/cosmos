# Exports all compliance scraper classes.
from __future__ import annotations

from scraper.scrapers.fatf import FATFScraper
from scraper.scrapers.fincen import FinCENScraper
from scraper.scrapers.gdpr import GDPRScraper
from scraper.scrapers.mas import MASScraper
from scraper.scrapers.mica import MiCAScraper
from scraper.scrapers.ofac import OFACScraper
from scraper.scrapers.sec import SECScraper
from scraper.scrapers.vara import VARAScraper

__all__ = [
    "OFACScraper",
    "FinCENScraper",
    "SECScraper",
    "FATFScraper",
    "MiCAScraper",
    "GDPRScraper",
    "VARAScraper",
    "MASScraper",
]
