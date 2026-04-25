from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import RecommendationsRequest, RecommendationsResponse
from .openai_recommender import recommend_with_openai
from .compliance_checklist import (
    ComplianceFormRequest,
    ComplianceChecklistResponse,
    generate_checklist,
)
from .scraper_routes import router as scraper_router

# RegIntel requires motor and feedparser; make it optional so app starts without them
try:
    from .regintel.routes import router as regintel_router
    from .regintel.db import ensure_indexes as regintel_ensure_indexes
    from .regintel.seed import seed_sources_if_empty
    _regintel_available = True
except ModuleNotFoundError as e:
    regintel_router = regintel_ensure_indexes = seed_sources_if_empty = None
    _regintel_available = False
    import warnings
    warnings.warn(f"RegIntel disabled: missing dependency ({e.name}). Install with: pip install motor feedparser", UserWarning)


# Load env from local .env (if present). This is safe even if .env is missing.
load_dotenv()

app = FastAPI(title="Cosmos AI Backend", version="0.1.0")
if _regintel_available:
    app.include_router(regintel_router)
app.include_router(scraper_router)

# CORS: allow local dev by default; override with CORS_ALLOW_ORIGINS (comma-separated)
allow_origins_raw = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allow_origins = [o.strip() for o in allow_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.on_event("startup")
async def startup():
    if _regintel_available and regintel_ensure_indexes and seed_sources_if_empty:
        try:
            await regintel_ensure_indexes()
            await seed_sources_if_empty()
        except Exception:
            pass  # MongoDB may not be configured


@app.post("/api/compliance/checklist", response_model=ComplianceChecklistResponse)
def compliance_checklist(req: ComplianceFormRequest) -> ComplianceChecklistResponse:
    """
    Accept form inputs from the compliance checker and return a list of compliances to follow.
    Uses OpenAI to generate actionable checklist items based on business type, geography, etc.
    """
    return generate_checklist(req)


@app.post("/api/widgets/recommendations", response_model=RecommendationsResponse)
def widget_recommendations(req: RecommendationsRequest) -> RecommendationsResponse:
    """
    Returns 2–3 widget bundles (combinations) with per-widget 'why' and numeric estimates:
    - time saved (hours/month)
    - cost savings (USD/month)

    Uses OpenAI if configured, otherwise falls back to heuristics.
    """
    return recommend_with_openai(req)

