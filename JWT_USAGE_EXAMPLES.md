# JWT Token Usage Examples

## 1. Get a JWT Token

```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=strillips&password=Diogo20!"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## 2. Use JWT Token in API Requests

Once you have a token, use it in the Authorization header:

```bash
# Save the token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use it in requests (example protected endpoint)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/protected-endpoint
```

## 3. Decode JWT Token (See What's Inside)

JWT tokens contain 3 parts separated by dots:
- Header (algorithm info)
- Payload (user data)
- Signature (verification)

**JavaScript Example:**
```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Shows: { sub: "strillips", exp: 1761111329 }
```

**Python Example:**
```python
import jwt
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
decoded = jwt.decode(token, options={"verify_signature": False})
print(decoded)
# Shows: {'sub': 'strillips', 'exp': 1761111329}
```

**Command Line:**
```bash
echo "$TOKEN" | cut -d'.' -f2 | base64 -d | python3 -m json.tool
```

## 4. Token Contents

A typical token contains:
```json
{
  "sub": "strillips",        // Subject (username)
  "exp": 1761111329          // Expiration timestamp
}
```

## 5. Test Different Scenarios

**Successful Login:**
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=strillips&password=Diogo20!"
```

**Failed Login (wrong password):**
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=strillips&password=wrong"
```

**Health Check:**
```bash
curl http://localhost:8000/health
```

## 6. Token Expiration

Tokens expire after 30 minutes. After expiration:
- Token becomes invalid
- User must login again to get a new token
- The `exp` field contains the expiration timestamp

**Check if token is expired:**
```python
import time
expiration = 1761111329
if time.time() > expiration:
    print("Token expired!")
else:
    print("Token still valid")
```

## 7. Security Best Practices

- **Never** share your JWT tokens
- **Never** commit tokens to version control
- Tokens are like passwords - keep them secret
- Use HTTPS in production to protect tokens in transit
- Store tokens securely (not in localStorage for sensitive apps)

## 8. API Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
