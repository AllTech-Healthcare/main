import os
from backend.db.models import Base, Patient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Set up test environment with proper Fernet key
from cryptography.fernet import Fernet
test_key = Fernet.generate_key()
os.environ["ENCRYPTION_KEY"] = test_key.decode()


def test_patient_encryption():
    engine = create_engine("sqlite:///:memory:")
    Session = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)
    session = Session()

    patient = Patient(name="Alice", phone="12345")
    session.add(patient)
    session.commit()

    fetched = session.query(Patient).first()
    assert fetched.name == "Alice"

    # verify stored value is encrypted
    result = session.execute(
        text("SELECT name FROM patients WHERE id=:id"),
        {"id": fetched.id},
    )
    raw = result.fetchone()[0]
    assert raw != b"Alice"
