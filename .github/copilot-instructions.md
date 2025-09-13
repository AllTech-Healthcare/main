# AllTech Healthcare - GitHub Copilot Instructions

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

AllTech Healthcare is a POPIA-compliant healthcare platform with a microservices architecture consisting of a Python FastAPI backend with JWT authentication, a React frontend, and placeholder ML services.

## Working Effectively

### Bootstrap and Setup
Run these commands in order to set up the development environment:

```bash
# Navigate to repository root
cd /home/runner/work/main/main

# Set required environment variable for auth service - CRITICAL for all backend operations
export JWT_SECRET_KEY="test-secret-key-for-development"

# Install Python dependencies - NEVER CANCEL: Takes 15 seconds
pip install -r backend/requirements.txt
```

**NEVER CANCEL dependency installation** - Set timeout to 60+ seconds minimum.

### Build and Test
Run these commands to validate the codebase:

```bash
# Lint the backend code - Takes 0.2 seconds
flake8 backend

# Run tests - NEVER CANCEL: Takes 2 seconds, set timeout to 30+ seconds
export JWT_SECRET_KEY="test-secret-key-for-development"
pytest backend/tests -v
```

**CRITICAL**: The JWT_SECRET_KEY environment variable MUST be set before running tests or starting the backend service.

### Run the Application

#### Backend API Service
```bash
# Start the FastAPI authentication service - NEVER CANCEL: May take 5+ seconds to start
cd backend
export JWT_SECRET_KEY="test-secret-key-for-development" 
uvicorn auth.auth_service:app --host 0.0.0.0 --port 8000
```

The service will be available at http://localhost:8000

#### Frontend (React Application)
The frontend is contained in the file "Vercel " (note the space in filename) which is a 1300-line React application. The frontend is currently a standalone file and does not have a traditional build process.

### Docker Builds
**WARNING**: Docker builds have known limitations in sandboxed environments:

```bash
# Frontend build - NEVER CANCEL: Takes 5 seconds, set timeout to 60+ seconds
docker build -t frontend ./frontend

# ML Services build - NEVER CANCEL: Takes 2 seconds, set timeout to 60+ seconds  
docker build -t ml-services ./ml-services

# Backend build - FAILS due to SSL certificate issues in sandbox environments
# docker build -t backend ./backend  # DO NOT USE - will fail with SSL errors
```

**Note**: Backend Docker builds fail due to PyPI SSL certificate verification issues in sandboxed environments. Use direct Python execution instead.

## Validation Scenarios

### Authentication Testing
ALWAYS test authentication functionality after making changes to the auth service:

```bash
# Start the backend service first
export JWT_SECRET_KEY="test-secret-key-for-development"
cd backend && uvicorn auth.auth_service:app --host 0.0.0.0 --port 8000 &

# Wait 3 seconds for service to start
sleep 3

# Test successful login (should return JWT token)
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice&password=secret"

# Test failed login (should return error)
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice&password=wrong"
```

**Test Credentials**: 
- Username: `alice`
- Password: `secret`

### Pre-commit Validation
ALWAYS run these commands before committing changes:

```bash
# Set the required environment variable
export JWT_SECRET_KEY="test-secret-key-for-development"

# Lint code
flake8 backend

# Run all tests - NEVER CANCEL: Set timeout to 60+ seconds
pytest backend/tests -v
```

## Repository Structure

### Key Directories
```
.
├── backend/           # Python FastAPI service with JWT auth
│   ├── auth/         # Authentication service
│   ├── db/           # Database models with encrypted PHI
│   ├── tests/        # Unit tests
│   └── requirements.txt
├── frontend/         # Node.js/React application files
├── ml-services/      # Placeholder Python ML services
├── .github/
│   └── workflows/    # CI/CD pipeline
└── Vercel            # React frontend application (1300 lines)
```

### Important Files
- `backend/auth/auth_service.py` - Main FastAPI authentication service
- `backend/db/models.py` - POPIA-compliant encrypted data models  
- `backend/db/encryption.py` - PHI encryption utilities
- `backend/requirements.txt` - Python dependencies
- `.github/workflows/ci.yml` - CI pipeline configuration
- `Vercel ` - React frontend application (note space in filename)

## Timing and Timeouts

**NEVER CANCEL any of these operations - they are expected to take time:**

| Operation | Expected Time | Recommended Timeout |
|-----------|---------------|-------------------|
| `pip install -r backend/requirements.txt` | 13 seconds | 60+ seconds |
| `pytest backend/tests` | 1 second | 30+ seconds |
| `flake8 backend` | 0.2 seconds | 30+ seconds |
| `docker build frontend` | 3 seconds | 60+ seconds |
| `docker build ml-services` | 1 second | 60+ seconds |
| Backend service startup | 2-5 seconds | 60+ seconds |

## Common Issues and Workarounds

### Environment Variables
- **JWT_SECRET_KEY**: Required for all backend operations. Set to any development value.
- Without this variable, tests and service startup will fail with "JWT_SECRET_KEY environment variable not set"

### Docker Build Limitations
- Backend Docker build fails in sandboxed environments due to SSL certificate issues with PyPI
- Use direct Python execution instead: `pip install -r backend/requirements.txt`
- Frontend and ML services Docker builds work correctly

### Database Warnings
- SQLAlchemy deprecation warning about `declarative_base()` - this is informational only
- DateTime deprecation warning about `utcnow()` - this is informational only

## Testing Requirements

### Unit Tests
Two test files exist:
- `backend/tests/test_auth.py` - Tests JWT token creation
- `backend/tests/test_db.py` - Tests encrypted patient data storage

### Manual Validation
After making authentication changes, ALWAYS:
1. Start the backend service
2. Test login with valid credentials (alice/secret)  
3. Test login with invalid credentials
4. Verify JWT token is returned on success
5. Verify error message on failure

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
1. **lint-test job**: Python setup, dependency install, flake8 linting, pytest
2. **build job**: Docker builds for all three services

**Note**: CI builds may fail due to Docker backend build issues in certain environments.

## Security and Compliance

This application handles Protected Health Information (PHI) and includes:
- JWT-based authentication
- Encrypted storage of patient data using Fernet encryption
- POPIA compliance measures in data models
- Secure password handling (demo uses plaintext for simplicity)

ALWAYS ensure PHI data is properly encrypted when making database changes.