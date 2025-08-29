from backend.db.models import Base, Patient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


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
