"""Compatibility entrypoint.

Supports:
- uvicorn main:app
- uvicorn app.main:app
"""

from app.main import app
