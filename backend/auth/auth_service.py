"""JWT-based authentication service for AllTech Healthcare.

This module provides secure JWT token-based authentication for the healthcare
platform. It implements POPIA-compliant security measures for protecting
patient health information.

Security Features:
    - JWT token generation and validation
    - Configurable token expiration
    - Environment-based secret key management
    - OAuth2 password flow authentication

Production Requirements:
    - Set JWT_SECRET_KEY environment variable to a strong secret
    - Use proper password hashing (e.g., bcrypt, argon2)
    - Implement rate limiting on authentication endpoints
    - Enable HTTPS/TLS in production
    - Configure CORS appropriately
"""
from datetime import datetime, timedelta, timezone
import logging
import os
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
SECRET_KEY = os.environ.get(
    "JWT_SECRET_KEY",
    "default-secret-key-change-in-production"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Validate secret key configuration
if SECRET_KEY == "default-secret-key-change-in-production":
    logger.warning(
        "SECURITY WARNING: Using default JWT secret key. "
        "Set JWT_SECRET_KEY environment variable in production!"
    )

# Fake database for demo purposes
# TODO: Replace with proper database and password hashing for production
demo_user_credentials = {
    "strillips": {
        "username": "strillips",
        "hashed_password": "Diogo20!",  # Plaintext for demo only - USE BCRYPT!
    }
}

app = FastAPI(
    title="AllTech Healthcare Authentication Service",
    description="POPIA-compliant JWT authentication for healthcare platform",
    version="1.0.0"
)


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate a user against the database.

    Args:
        username: The username to authenticate
        password: The password to verify

    Returns:
        User dictionary if authentication succeeds, None otherwise

    Note:
        This is a demo implementation using plaintext passwords.
        Production systems MUST use proper password hashing (bcrypt/argon2).
    """
    user_record = demo_user_credentials.get(username)
    if not user_record or password != user_record["hashed_password"]:
        logger.info(f"Failed authentication attempt for user: {username}")
        return None
    logger.info(f"Successful authentication for user: {username}")
    return user_record


def create_access_token(
    data: dict, expires_delta: Optional[timedelta] = None
) -> str:
    """Create a JWT access token.

    Args:
        data: The data to encode in the token (typically user info)
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token string

    Note:
        Uses UTC timezone for consistency across deployments.
        Tokens include 'exp' claim for automatic expiration validation.
    """
    token_payload = data.copy()
    # Use timezone-aware datetime for better compatibility
    expiration_time = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=15)
    )
    token_payload.update({"exp": expiration_time})
    encoded_token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)
    logger.debug(f"Created access token for: {data.get('sub', 'unknown')}")
    return encoded_token


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint that returns a JWT token.

    Args:
        form_data: OAuth2 password form with username and password

    Returns:
        Dictionary with access_token and token_type

    Raises:
        HTTPException: 401 Unauthorized if credentials are invalid

    Example:
        curl -X POST "http://localhost:8000/token" \
             -H "Content-Type: application/x-www-form-urlencoded" \
             -d "username=alice&password=secret"
    """
    authenticated_user = authenticate_user(
        form_data.username, form_data.password
    )
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": authenticated_user["username"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and load balancers.

    Returns:
        Dictionary with service status
    """
    return {
        "status": "healthy",
        "service": "auth",
        "version": "1.0.0"
    }
