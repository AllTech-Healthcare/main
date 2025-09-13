"""Utilities for encrypting/decrypting PHI fields."""
import os
from cryptography.fernet import Fernet

# Get encryption key from environment or generate for development
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    # For development only - in production this should always be set
    import warnings
    warnings.warn(
        "ENCRYPTION_KEY not set in environment. Using generated key for "
        "development. Data will not persist between restarts!",
        UserWarning
    )
    ENCRYPTION_KEY = Fernet.generate_key()
else:
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()

fernet = Fernet(ENCRYPTION_KEY)


def encrypt(value: str) -> bytes:
    return fernet.encrypt(value.encode())


def decrypt(value: bytes) -> str:
    return fernet.decrypt(value).decode()
