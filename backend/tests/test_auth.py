"""Tests for authentication service."""
from backend.auth.auth_service import (
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
import jwt


def test_create_access_token():
    """Test that JWT tokens are created correctly."""
    token = create_access_token({"sub": "alice"})
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "alice"
    assert "exp" in decoded  # Expiration should be set
