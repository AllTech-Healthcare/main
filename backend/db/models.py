"""POPIA-compliant data models with encrypted fields for PHI."""
from sqlalchemy import Column, Integer, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import TypeDecorator

from .encryption import encrypt, decrypt

Base = declarative_base()


class EncryptedString(TypeDecorator):
    impl = LargeBinary

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return encrypt(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return decrypt(value)


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True)
    name = Column(EncryptedString, nullable=False)
    phone = Column(EncryptedString, nullable=False)
