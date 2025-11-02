"""Utilities for encrypting/decrypting PHI fields."""
import os
from cryptography.fernet import Fernet


def get_encryption_key() -> bytes:
    """Get encryption key from environment or generate a default one.

    WARNING: In production, ENCRYPTION_KEY must be set as an environment
    variable and securely stored. Never use the generated key in
    production.
    """
    environment_key = os.environ.get("ENCRYPTION_KEY")
    if environment_key:
        return environment_key.encode()

    # Default key for development only
    # In production, this should raise an error
    print("WARNING: Using default encryption key. "
          "Set ENCRYPTION_KEY environment variable in production!")
    return b'qzO6_qG9vN5yZ9xK4_PxF_N7xR8wY3lK9mN2vB5cD8E='


ENCRYPTION_KEY = get_encryption_key()
fernet_cipher = Fernet(ENCRYPTION_KEY)


def encrypt(value: str) -> bytes:
    """Encrypt a string value."""
    return fernet_cipher.encrypt(value.encode())


def decrypt(value: bytes) -> str:
    """Decrypt a bytes value to string."""
    return fernet_cipher.decrypt(value).decode()
