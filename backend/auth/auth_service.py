"""Simple JWT-based auth service using FastAPI."""
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
import hashlib
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
import jwt

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    import warnings
    warnings.warn(
        "JWT_SECRET_KEY not set in environment. Using generated key for "
        "development. Tokens will not persist between restarts!",
        UserWarning
    )
    SECRET_KEY = "dev_secret_key_change_in_production"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    """Simple password hashing for demo - use proper hashing in production."""
    return hashlib.sha256(password.encode()).hexdigest()


fake_users_db = {
    "alice": {
        "username": "alice",
        "hashed_password": hash_password("secret"),
        "email": "alice@example.com"
    },
    "demo": {
        "username": "demo",
        "hashed_password": hash_password("demo"),
        "email": "demo@example.com"
    }
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str
    email: str


app = FastAPI(title="TapeRX Auth Service")


def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user or hash_password(password) != user["hashed_password"]:
        return None
    return user


def create_access_token(
    data: dict, expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=15)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = fake_users_db.get(username)
    if user is None:
        raise credentials_exception
    return User(username=user["username"], email=user["email"])


@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
