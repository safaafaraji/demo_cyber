# API Documentation v1.0.0

## Authentication

### Login
`POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "ey...",
  "refreshToken": "ey...",
  "user": { ... }
}
```

### Register
`POST /api/v1/auth/register`

---

## Laboratories

### Get All Labs
`GET /api/v1/labs`
*Requires Authentication*

**Response:**
```json
[
  {
    "_id": "...",
    "name": "SQL Injection Basic",
    "difficulty": "easy",
    "points": 100
  }
]
```

### Start Lab Session
`POST /api/v1/sessions/start`
*Requires Authentication*

**Request:**
```json
{
  "labId": "..."
}
```
