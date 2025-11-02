"""Tests for authentication service."""
from backend.auth.auth_service import (
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
import jwt


def test_create_access_token():
    """Test that JWT tokens are created correctly."""
    jwt_token = create_access_token({"sub": "alice"})
    decoded_payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded_payload["sub"] == "alice"
    assert "exp" in decoded_payload  # Expiration should be set
