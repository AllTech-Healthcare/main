import os
import sys
from cryptography.fernet import Fernet

# Set up test environment BEFORE importing anything else
os.environ["JWT_SECRET_KEY"] = "test_secret_key"

# Generate proper Fernet key for testing
test_key = Fernet.generate_key()
os.environ["ENCRYPTION_KEY"] = test_key.decode()

# Add backend to Python path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "taperx-api"}


def test_auth_health_check():
    response = client.get("/auth/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_get_schedule_requires_auth():
    response = client.get("/api/schedule")
    assert response.status_code == 401


def test_login_and_access_protected_route():
    # Test login
    login_data = {"username": "demo", "password": "demo"}
    response = client.post("/auth/token", data=login_data)
    assert response.status_code == 200

    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Use token to access protected route
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    response = client.get("/api/user/profile", headers=headers)
    assert response.status_code == 200

    user_data = response.json()
    assert user_data["username"] == "demo"
    assert user_data["email"] == "demo@example.com"


def test_get_dashboard_with_auth():
    # Login first
    login_data = {"username": "demo", "password": "demo"}
    response = client.post("/auth/token", data=login_data)
    token = response.json()["access_token"]

    # Access dashboard
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/dashboard", headers=headers)
    assert response.status_code == 200

    dashboard_data = response.json()
    assert "recovery_score" in dashboard_data
    assert "current_dose" in dashboard_data
    assert "next_dose" in dashboard_data
