# AllTech Healthcare Platform

🏥 **AI-Enhanced Medication Tapering Solutions (TapeRX)**

A POPIA-compliant healthcare platform specializing in safe, AI-assisted psychiatric medication tapering with clinical oversight.

## 🚀 Quick Start

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
JWT_SECRET_KEY="your-secret-key" uvicorn auth.auth_service:app --reload
```

### Testing
```bash
cd backend
JWT_SECRET_KEY="test-key" python -m pytest tests/ -v
```

### Linting
```bash
cd backend
python -m flake8 --max-line-length=88 .
```

## 🔒 Security & Compliance

This platform handles **Protected Health Information (PHI)** and must comply with:
- 🇿🇦 **POPIA** (Protection of Personal Information Act) - South African data protection law
- 🔐 **PHI Encryption** - All patient data encrypted at rest using Fernet encryption
- 🏥 **Clinical Oversight** - AI provides decision support only, not autonomous medical decisions

## 🏗️ Architecture

```
backend/           # FastAPI with encrypted PHI storage
├── auth/          # JWT authentication
├── db/            # SQLAlchemy models with encryption
└── tests/         # Security & compliance tests

frontend/          # React application (TapeRX)
ml-services/       # AI/ML predictive analytics
.github/           # GitHub workflows & Copilot instructions
```

## 🤖 GitHub Copilot Setup

This repository includes comprehensive **GitHub Copilot instructions** at `.github/copilot-instructions.md` that provide:

- 🏥 Healthcare context and POPIA compliance guidelines
- 🔒 Security patterns for PHI encryption
- 🏗️ Architecture and coding standards
- ⚠️ Critical healthcare safety considerations

The instructions ensure Copilot generates code that is:
- **Compliant** with healthcare regulations
- **Secure** with proper PHI encryption
- **Safe** with clinical oversight requirements
- **Tested** with appropriate security validations

## ⚠️ Important Medical Disclaimer

This platform deals with **psychiatric medication tapering** - a high-risk medical procedure. All AI recommendations are for decision support only and require licensed healthcare practitioner oversight. Consider withdrawal syndrome risks including seizures, psychosis, and suicide ideation.

## 📋 Development Guidelines

- **Security First**: All PHI must use `EncryptedString` type
- **Human Oversight**: AI supplements but never replaces clinical judgment
- **Compliance**: POPIA compliance is legally required
- **Testing**: Include security and compliance tests
- **Documentation**: Document healthcare-specific considerations

## 🔬 Technology Stack

- **Backend**: FastAPI, SQLAlchemy, JWT authentication
- **Frontend**: React (TapeRX), Tailwind CSS
- **Database**: PostgreSQL with Fernet encryption
- **ML**: Predictive analytics with clinical validation
- **Testing**: pytest, security validation
- **Linting**: flake8 with healthcare-appropriate standards

---

*This is life-critical software. Always prioritize patient safety, security, and regulatory compliance.*