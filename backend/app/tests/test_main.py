"""
Test module for main FastAPI application endpoints.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test the health check endpoint."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "ok",
            "message": "Hastane Randevu Sistemi çalışıyor",
        }


@pytest.mark.asyncio
async def test_health_check_response_structure():
    """Test that health check returns proper JSON structure."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")

        data = response.json()
        assert "status" in data
        assert isinstance(data["status"], str)
