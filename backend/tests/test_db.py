from backend.db.models import Base, Patient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


def test_patient_encryption():
    database_engine = create_engine("sqlite:///:memory:")
    SessionFactory = sessionmaker(bind=database_engine)
    Base.metadata.create_all(database_engine)
    database_session = SessionFactory()

    test_patient = Patient(patient_name="Alice", phone_number="12345")
    database_session.add(test_patient)
    database_session.commit()

    retrieved_patient = database_session.query(Patient).first()
    assert retrieved_patient.patient_name == "Alice"

    # verify stored value is encrypted
    query_result = database_session.execute(
        text("SELECT patient_name FROM patients WHERE patient_id=:patient_id"),
        {"patient_id": retrieved_patient.patient_id},
    )
    encrypted_raw_value = query_result.fetchone()[0]
    assert encrypted_raw_value != b"Alice"
