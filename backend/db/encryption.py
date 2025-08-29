"""Utilities for encrypting/decrypting PHI fields."""
from cryptography.fernet import Fernet

ENCRYPTION_KEY = Fernet.generate_key()
fernet = Fernet(ENCRYPTION_KEY)


def encrypt(value: str) -> bytes:
    return fernet.encrypt(value.encode())


def decrypt(value: bytes) -> str:
    return fernet.decrypt(value).decode()
