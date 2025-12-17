"""
Integration tests for user authentication flow.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_register_endpoint_exists():
    """Test that register endpoint is accessible."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/auth/register", json={})
        # Should return 422 (validation error), not 404
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_endpoint_exists():
    """Test that login endpoint is accessible."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/auth/login", json={})
        # Should return 422 (validation error), not 404
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_requires_credentials():
    """Test that login validates required fields."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/auth/login", json={
            "username": "",
            "password": ""
        })
        # Should fail validation
        assert response.status_code in [400, 422]
