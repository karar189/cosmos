from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import RecommendationsRequest, RecommendationsResponse
from .openai_recommender import recommend_with_openai


# Load env from local .env (if present). This is safe even if .env is missing.
load_dotenv()

app = FastAPI(title="Cosmos AI Backend", version="0.1.0")

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


@app.post("/api/widgets/recommendations", response_model=RecommendationsResponse)
def widget_recommendations(req: RecommendationsRequest) -> RecommendationsResponse:
    """
    Returns 2–3 widget bundles (combinations) with per-widget 'why' and numeric estimates:
    - time saved (hours/month)
    - cost savings (USD/month)

    Uses OpenAI if configured, otherwise falls back to heuristics.
    """
    return recommend_with_openai(req)

