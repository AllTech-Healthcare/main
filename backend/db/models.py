"""POPIA-compliant data models with encrypted fields for PHI."""
from sqlalchemy import Column, Integer, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import TypeDecorator

from .encryption import encrypt, decrypt

Base = declarative_base()


class EncryptedString(TypeDecorator):
    impl = LargeBinary

    def process_bind_param(self, plaintext_value, dialect):
        if plaintext_value is None:
            return plaintext_value
        return encrypt(plaintext_value)

    def process_result_value(self, encrypted_value, dialect):
        if encrypted_value is None:
            return encrypted_value
        return decrypt(encrypted_value)


class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True)
    patient_name = Column(EncryptedString, nullable=False)
    phone_number = Column(EncryptedString, nullable=False)
