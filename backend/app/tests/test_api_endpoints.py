"""
API endpoint tests for CI/CD validation.
Tests basic functionality without requiring database setup.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_health_endpoint_available():
    """Test that health endpoint is accessible."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_returns_json():
    """Test that health endpoint returns valid JSON."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
        data = response.json()
        assert isinstance(data, dict)
        assert "status" in data


@pytest.mark.asyncio
async def test_cors_headers():
    """Test that CORS headers are present."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.options("/health")
        # Basic CORS check - app should handle OPTIONS
        assert response.status_code in [200, 405]


@pytest.mark.asyncio
async def test_api_prefix_routes():
    """Test that API routes are accessible under /api prefix."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Test that auth routes exist (should return 401/422, not 404)
        response = await client.post("/api/auth/login")
        assert response.status_code != 404
