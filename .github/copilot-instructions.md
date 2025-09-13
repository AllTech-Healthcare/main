# AllTech-Healthcare Main Repository

AllTech-Healthcare is a POPIA-compliant (South African privacy law) healthcare technology platform with a microservices architecture focused on psychiatric medication management. The system includes backend authentication services (FastAPI), frontend applications (React), and machine learning services for healthcare analytics.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Quick Start - Build and Test Everything
Run these commands in sequence to bootstrap and validate the entire repository:

```bash
# Install Python dependencies (takes ~11 seconds, may fail in sandboxed environments)
# Note: pip upgrade may fail due to network/SSL issues in sandboxed environments
pip install -r backend/requirements.txt

# Lint the backend (takes ~0.15 seconds)  
flake8 backend

# Test the backend with required environment variable (takes ~0.85 seconds)
JWT_SECRET_KEY="test-secret-key" pytest backend/tests

# Build all Docker images
docker build -t frontend ./frontend        # takes ~0.3 seconds (cached)
docker build -t ml-services ./ml-services  # takes ~0.3 seconds (cached)
# NOTE: Backend Docker build fails due to SSL certificate issues with PyPI in sandboxed environments
```

### Backend Development (Python FastAPI)
- **Python Version**: 3.11 (works with 3.12+)
- **Framework**: FastAPI with JWT authentication
- **Testing**: pytest with 2 tests (auth and database encryption)
- **Linting**: flake8 (zero configuration needed)

**Critical Environment Variable**: 
- `JWT_SECRET_KEY` must be set for all backend operations (tests, running service)
- Use any value for development: `JWT_SECRET_KEY="test-secret-key"`

**Development Commands**:
```bash
# Install dependencies (~11 seconds, may fail in sandboxed environments)
pip install -r backend/requirements.txt

# Run linting (~0.15 seconds)
flake8 backend

# Run tests (~0.85 seconds) - REQUIRES JWT_SECRET_KEY
JWT_SECRET_KEY="test-secret-key" pytest backend/tests

# Start the auth service
JWT_SECRET_KEY="test-secret-key" uvicorn backend.auth.auth_service:app --host 0.0.0.0 --port 8000
```

**Test User Account**:
- Username: `alice`
- Password: `secret`

### Frontend Development (React)
- **Framework**: React with hooks, context, and Tailwind-style classes
- **Application**: Comprehensive healthcare app for psychiatric medication management (1300 lines)
- **Location**: The main React application code is in the `Vercel ` file (note trailing space)
- **Pages**: Landing, Dashboard, Schedule, Symptoms, Communication, AI Analytics
- **Features**: JWT authentication, medication tracking, symptom monitoring, AI analytics

**Key Components**:
- `LandingPage`: User authentication and onboarding
- `DashboardPage`: Main patient dashboard with medication status
- `SymptomsPage`: Daily symptom tracking and check-ins
- `AIAnalyticsPage`: Machine learning insights and analytics
- `SchedulePage`: Medication scheduling and calendar
- `CommunicationPage`: Patient-provider communication

**Current State**: Frontend is a placeholder in `frontend/` directory, but full application exists in `Vercel ` file.

### ML Services Development
- **Framework**: Python-based placeholder for machine learning microservices
- **Current State**: Placeholder implementation
- **Docker**: Simple container that prints "ML service placeholder"

### Database and Security
- **Compliance**: POPIA (Protection of Personal Information Act) compliant
- **Encryption**: PHI (Protected Health Information) fields are encrypted using Fernet
- **Models**: Patient model with encrypted name and phone fields
- **Database**: SQLAlchemy with encrypted field support

## Build Times and Timeouts

**CRITICAL - NEVER CANCEL builds or long-running commands. Always use appropriate timeouts:**

- `pip install -r backend/requirements.txt`: 11 seconds (use 60+ second timeout, may fail in sandboxed environments)
- `flake8 backend`: 0.15 seconds (use 30+ second timeout)  
- `pytest backend/tests`: 0.85 seconds (use 30+ second timeout)
- `docker build frontend`: 0.3 seconds cached (use 5+ minute timeout for fresh builds)
- `docker build ml-services`: 0.3 seconds cached (use 5+ minute timeout for fresh builds)
- Backend auth service startup: ~2 seconds (use 30+ second timeout)

**Docker Build Limitations**:
- Backend Docker build FAILS due to SSL certificate issues with PyPI in sandboxed environments
- Frontend and ML services Docker builds work correctly
- Use local Python environment for backend development

## Testing and Validation

### Backend Authentication Testing
```bash
# Start the service (requires JWT_SECRET_KEY)
JWT_SECRET_KEY="test-secret-key" uvicorn backend.auth.auth_service:app --host 0.0.0.0 --port 8000

# Test valid authentication
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice&password=secret"
# Expected: {"access_token":"...","token_type":"bearer"}

# Test invalid authentication  
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice&password=wrong"
# Expected: {"detail":"Incorrect username or password"}
```

### Container Testing
```bash
# Test frontend container
docker run --rm frontend
# Expected output: "Frontend placeholder"

# Test ML services container  
docker run --rm ml-services
# Expected output: "ML service placeholder"
```

### CI/CD Validation
Always run these before committing to ensure CI pipeline passes:
```bash
# Linting (matches CI pipeline)
flake8 backend

# Testing (matches CI pipeline) 
JWT_SECRET_KEY="test-secret-key" pytest backend/tests
```

## Repository Structure

```
/home/runner/work/main/main/
├── .github/
│   └── workflows/ci.yml          # CI pipeline: lint, test, Docker builds
├── backend/                      # FastAPI authentication service
│   ├── auth/
│   │   ├── auth_service.py       # Main FastAPI app with JWT auth
│   │   └── __init__.py
│   ├── db/
│   │   ├── models.py             # POPIA-compliant encrypted models
│   │   ├── encryption.py         # PHI encryption utilities
│   │   └── __init__.py
│   ├── tests/
│   │   ├── test_auth.py          # JWT token testing
│   │   ├── test_db.py            # Database encryption testing
│   │   └── __init__.py
│   ├── Dockerfile                # Backend container (fails in sandboxed env)
│   └── requirements.txt          # Python dependencies
├── frontend/                     # Placeholder directory
│   ├── Dockerfile                # Working frontend container
│   └── README.md                 # Placeholder documentation
├── ml-services/                  # Placeholder directory
│   ├── Dockerfile                # Working ML services container
│   └── README.md                 # Placeholder documentation
└── Vercel                        # 1300-line React healthcare application
```

## Common Issues and Solutions

### Authentication Issues
- **Error**: `RuntimeError: JWT_SECRET_KEY environment variable not set`
- **Solution**: Always set `JWT_SECRET_KEY="test-secret-key"` when running backend code

### Docker Build Issues  
- **Backend Docker build fails**: Known issue with SSL certificates in sandboxed environments
- **Pip install failures**: May occur in sandboxed environments due to network/SSL issues
- **Solution**: Use local Python environment for backend development

### Test Failures
- **Tests require JWT_SECRET_KEY**: Always prefix test commands with environment variable
- **Database warnings**: Ignore SQLAlchemy deprecation warnings about `declarative_base()`

### Network Limitations in Sandboxed Environments
- **Pip operations may timeout**: Due to SSL/network restrictions
- **Docker builds requiring PyPI access fail**: Use pre-installed packages when possible
- **Workaround**: Instructions tested with pre-installed dependencies

## Key Development Workflows

### Adding New Features
1. **Backend changes**: Always test with `JWT_SECRET_KEY="test-secret-key" pytest backend/tests`
2. **Frontend changes**: Update the React code in the `Vercel ` file
3. **Linting**: Always run `flake8 backend` before committing
4. **Integration**: Test authentication flow with curl commands

### Debugging Authentication
1. Start backend service with JWT_SECRET_KEY set
2. Test with valid credentials (alice/secret) first
3. Verify token generation and validation
4. Check for proper error handling with invalid credentials

### POPIA Compliance
- Never log or expose encrypted patient data
- Always use encrypted fields for PHI (name, phone, medical data)
- Test encryption/decryption with database tests
- Verify stored values are encrypted in database

## External Dependencies

The system relies on standard Python packages available via pip:
- `fastapi`: Web framework
- `pyjwt`: JWT token handling  
- `cryptography`: Encryption for PHI data
- `sqlalchemy`: Database ORM with encryption support
- `uvicorn`: ASGI server
- `pytest`: Testing framework
- `flake8`: Code linting

No external services or special SDK downloads required for basic development.