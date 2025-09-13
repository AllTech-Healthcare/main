# AllTech Healthcare Application
AllTech Healthcare is a POPIA-compliant healthcare platform with microservices architecture built using Python FastAPI backend, React frontend, and containerized ML services. The platform handles encrypted personal health information (PHI) with JWT authentication.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Development Setup
**Required Environment Variable:**
```bash
export JWT_SECRET_KEY="test-secret-key-for-development"
```
This environment variable is REQUIRED for all backend operations and testing.

### Backend Development (Python FastAPI)
- **Install dependencies:** `pip install -r backend/requirements.txt` 
  - Takes ~25 seconds. Timeout: 60 seconds.
- **Run linting:** `flake8 backend`
  - Takes <1 second. Always passes with current code.
- **Run tests:** `pytest backend/tests -v`
  - Takes ~2 seconds. Requires JWT_SECRET_KEY environment variable.
- **Start backend service:** `uvicorn backend.auth.auth_service:app --host 0.0.0.0 --port 8000`
  - Starts in ~2 seconds. Access API docs at http://localhost:8000/docs

### Docker Operations
- **Build backend:** `docker build -t backend ./backend`
  - **FAILS in current environment** due to SSL certificate issues with PyPI. Document as: "Backend Docker build fails due to SSL certificate verification issues in the container environment."
- **Build frontend:** `docker build -t frontend ./frontend`
  - Takes ~3-5 seconds. NEVER CANCEL.
- **Build ML services:** `docker build -t ml-services ./ml-services`
  - Takes <1 second.

### Testing and Validation
**ALWAYS validate changes with these steps:**
1. **Environment setup:** Set JWT_SECRET_KEY environment variable
2. **Dependencies:** `pip install -r backend/requirements.txt`
3. **Linting validation:** `flake8 backend` - must pass
4. **Test suite:** `pytest backend/tests -v` - both tests must pass
5. **End-to-end authentication test:**
   ```bash
   # Start service in background
   uvicorn backend.auth.auth_service:app --host 0.0.0.0 --port 8000 &
   sleep 3
   # Test authentication
   curl -X POST "http://localhost:8000/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=alice&password=secret"
   # Should return JWT token
   ```

## Validation Scenarios
**CRITICAL: Always test these scenarios after making changes:**

### Authentication Flow Test
1. Start the backend service with proper JWT_SECRET_KEY
2. Test valid login (username: alice, password: secret) - should return JWT token
3. Test invalid login (wrong password) - should return 401 error
4. Verify API documentation is accessible at /docs endpoint

### Database Encryption Test
Run `pytest backend/tests/test_db.py -v` to verify:
- Patient data is properly encrypted in database
- Encrypted fields can be decrypted back to original values
- Raw database values are not readable plaintext

## CI/CD Pipeline
The `.github/workflows/ci.yml` pipeline runs:
1. **Python setup** (Python 3.11 specified in CI, Python 3.12+ works locally)
2. **Dependency installation** - takes ~30 seconds in CI
3. **Linting with flake8** - takes <5 seconds  
4. **Test execution with pytest** - takes ~15 seconds in CI
5. **Docker builds** for all three services - frontend and ml-services work, backend fails due to SSL issues

**NEVER CANCEL builds or tests** - Set timeouts of 120+ seconds for dependency installation and 60+ seconds for Docker builds.

## Project Structure
```
/
├── backend/           # Python FastAPI service
│   ├── auth/         # JWT authentication service
│   ├── db/           # POPIA-compliant encrypted data models
│   ├── tests/        # pytest test suite
│   └── requirements.txt
├── frontend/         # React application (placeholder Docker container)
├── ml-services/      # Python ML microservices (placeholder)
├── .github/workflows/ci.yml  # CI pipeline
└── Vercel            # React healthcare dashboard component (1300 lines)
```

## Key Components

### Backend Authentication (`backend/auth/auth_service.py`)
- JWT-based authentication with HS256 algorithm
- Test user: username="alice", password="secret"
- Token endpoint: POST /token with form data
- 30-minute token expiration
- **Environment requirement:** JWT_SECRET_KEY must be set

### Encrypted Database Models (`backend/db/models.py`)
- POPIA-compliant encrypted patient data storage
- Custom EncryptedString type for PHI fields
- SQLAlchemy-based with automatic encryption/decryption
- Uses Fernet symmetric encryption

### Frontend Dashboard (`Vercel` file)
- Comprehensive React healthcare dashboard (1300 lines)
- Patient scheduling, symptom tracking, clinical communication
- Multiple color schemes and responsive design
- Authentication context with localStorage token management

### Tests (`backend/tests/`)
- `test_auth.py`: JWT token creation and validation
- `test_db.py`: Database encryption functionality
- Both tests run in <2 seconds combined
- **Always pass** with proper environment setup

## Common Issues and Solutions

### Environment Variables
**Problem:** Tests fail with "JWT_SECRET_KEY environment variable not set"
**Solution:** Always set `export JWT_SECRET_KEY="test-secret-key-for-development"` before running any backend operations.

### Docker Build Failures  
**Problem:** Backend Docker build fails with SSL certificate errors
**Solution:** This is a known limitation. Use local development instead: `pip install -r backend/requirements.txt && uvicorn backend.auth.auth_service:app`

### Deprecation Warnings
**Expected warnings** in test output:
- SQLAlchemy declarative_base() deprecation warning
- datetime.datetime.utcnow() deprecation warning
These are **normal** and do not indicate failures.

## Development Workflow
1. **Always** set JWT_SECRET_KEY environment variable first
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Run tests to verify baseline: `pytest backend/tests -v`
4. Make your changes
5. **Always** run linting: `flake8 backend`
6. **Always** run full test suite: `pytest backend/tests -v`
7. **Always** test authentication endpoint manually
8. Commit only after all validations pass

## Quick Reference Commands
```bash
# Complete validation sequence (run this before any commit)
export JWT_SECRET_KEY="test-secret-key-for-development"
pip install -r backend/requirements.txt
flake8 backend
pytest backend/tests -v
uvicorn backend.auth.auth_service:app --host 0.0.0.0 --port 8000 &
sleep 3
curl -X POST "http://localhost:8000/token" -H "Content-Type: application/x-www-form-urlencoded" -d "username=alice&password=secret"
```

**All commands validated to work correctly. Total validation time: ~30 seconds.**