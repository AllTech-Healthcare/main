# GitHub Copilot Instructions for AllTech Healthcare Platform

## Project Overview

This is a **healthcare compliance platform** specializing in AI-enhanced medication tapering solutions (TapeRX). The platform handles **Protected Health Information (PHI)** and must comply with South African POPIA (Protection of Personal Information Act) regulations.

## 🏥 Healthcare Context & Compliance

### POPIA Compliance Requirements
- **All patient data MUST be encrypted** at rest and in transit
- Use the existing `EncryptedString` type for all PHI fields
- Patient names, phone numbers, medical records require encryption
- Implement data minimization principles
- Maintain audit trails for all data access

### Critical Healthcare Considerations
- This platform deals with **psychiatric medication tapering** - a high-risk medical procedure
- AI recommendations are **decision support only** - never replace clinical judgment
- All medication decisions require licensed healthcare practitioner oversight
- Consider withdrawal syndrome risks (seizures, psychosis, suicide ideation)

## 🔒 Security Patterns & Best Practices

### PHI Encryption (MANDATORY)
```python
# ALWAYS use EncryptedString for PHI
from backend.db.models import EncryptedString

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True)
    name = Column(EncryptedString, nullable=False)  # PHI - MUST encrypt
    phone = Column(EncryptedString, nullable=False)  # PHI - MUST encrypt
```

### Authentication & Authorization
```python
# JWT tokens with proper expiration
from backend.auth.auth_service import create_access_token

# Always verify JWT_SECRET_KEY environment variable
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY environment variable not set")
```

### Data Validation
- Validate all user inputs to prevent injection attacks
- Use FastAPI's dependency injection for authentication
- Implement proper error handling without exposing internal details

## 🏗️ Architecture Guidelines

### Backend (FastAPI)
- **Framework**: FastAPI with SQLAlchemy ORM
- **Authentication**: JWT-based with OAuth2PasswordRequestForm
- **Database**: Encrypted fields for PHI using Fernet encryption
- **Structure**: Modular design with auth, db, and business logic separation

### Frontend (React - TapeRX)
- **Framework**: React with context-based authentication
- **Styling**: Tailwind CSS with custom healthcare-appropriate color schemes
- **State Management**: React hooks and context for user sessions
- **UI/UX**: Accessibility-focused design for healthcare professionals

### ML Services
- **Purpose**: Predictive analytics for medication tapering optimization
- **Compliance**: All ML models must have human oversight
- **Validation**: Clinical validation required for all predictions

## 📁 Project Structure

```
backend/
├── auth/           # JWT authentication service
├── db/             # Database models with encryption
├── tests/          # Unit tests for backend components
└── requirements.txt

frontend/           # React application (TapeRX)
ml-services/        # Machine learning microservices
.github/           # GitHub workflows and configurations
```

## 🧪 Testing Guidelines

### Backend Testing
```python
# Test encrypted data handling
def test_patient_encryption():
    patient = Patient(name="Alice", phone="12345")
    # Verify stored value is encrypted
    assert raw_db_value != b"Alice"
    # Verify decryption works
    assert patient.name == "Alice"
```

### Security Testing
- Test authentication flows
- Verify PHI encryption/decryption
- Validate input sanitization
- Check authorization controls

## 🚀 Development Workflow

### Code Quality Standards
1. **Type Hints**: Use Python type hints for all functions
2. **Error Handling**: Implement proper exception handling
3. **Logging**: Use structured logging (no PHI in logs)
4. **Documentation**: Document all healthcare-specific functions

### Environment Variables
```bash
# Required environment variables
JWT_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...
ENCRYPTION_KEY=fernet-key
```

### Git Practices
- Small, focused commits
- Clear commit messages referencing healthcare impact
- Pull request reviews required for PHI-handling code

## 🎯 Code Generation Guidelines

### When Generating Code:

1. **Security First**: Always consider PHI encryption requirements
2. **Healthcare Context**: Remember this is medical software with patient safety implications
3. **Compliance**: Ensure POPIA compliance in data handling
4. **Error Handling**: Implement robust error handling for medical contexts
5. **Documentation**: Include healthcare-specific documentation
6. **Testing**: Generate appropriate tests for security and compliance

### Code Patterns to Follow:

#### Database Operations
```python
# Correct: Using encrypted fields for PHI
patient = Patient(
    name="John Doe",  # Automatically encrypted
    phone="+27123456789"  # Automatically encrypted
)

# Incorrect: Storing PHI in plain text
patient_data = {"name": "John Doe"}  # NEVER store PHI unencrypted
```

#### API Endpoints
```python
@app.post("/patients/")
async def create_patient(
    patient_data: PatientCreate,
    current_user: User = Depends(get_current_user)  # Always authenticate
):
    # Validate user has permission to create patients
    if not current_user.has_permission("create_patient"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Create patient with encrypted fields
    patient = Patient(**patient_data.dict())
    return patient
```

## ⚠️ Critical Reminders

1. **PHI Handling**: Never log, cache, or store PHI in plain text
2. **Medical Context**: This is life-critical software - prioritize safety and accuracy
3. **Compliance**: POPIA compliance is legally required - no exceptions
4. **Human Oversight**: AI is decision support only - not autonomous medical decisions
5. **Error Handling**: Graceful degradation for system failures in medical contexts

## 🔍 Code Review Checklist

When reviewing code suggestions:
- [ ] PHI properly encrypted using EncryptedString
- [ ] Authentication required for sensitive operations
- [ ] Error handling appropriate for medical context
- [ ] No PHI exposed in logs or error messages
- [ ] POPIA compliance maintained
- [ ] Clinical oversight preserved for medical decisions

---

**Remember**: This platform affects patient health and safety. Always prioritize security, compliance, and clinical oversight in all code suggestions.