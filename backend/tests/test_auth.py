from backend.auth.auth_service import (
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
import jwt


def test_create_access_token():
    token = create_access_token({"sub": "alice"})
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "alice"
