# API Documentation

## Swagger UI

The API documentation is available via Swagger UI at:

**http://localhost:3002/api-docs**

The Swagger documentation provides:
- Complete OpenAPI 3.0 specification
- Interactive endpoint testing
- Request/response schema examples
- Authentication requirements (Bearer token)
- RBAC requirements per endpoint

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and revoke token
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset

### Organizations
- `GET /api/orgs` - List user organizations
- `POST /api/orgs` - Create organization
- `GET /api/orgs/{orgId}` - Get organization details
- `PATCH /api/orgs/{orgId}` - Update organization (OWNER)
- `POST /api/orgs/{orgId}/members` - Add member (ADMIN)
- `PATCH /api/orgs/{orgId}/members/{userId}` - Update role (ADMIN)
- `DELETE /api/orgs/{orgId}/members/{userId}` - Remove member (ADMIN)

### Projects
- `GET /api/orgs/{orgId}/projects` - List projects
- `POST /api/orgs/{orgId}/projects` - Create project (ADMIN)
- `GET /api/orgs/{orgId}/projects/{projectId}` - Get project
- `PATCH /api/orgs/{orgId}/projects/{projectId}` - Update project (ADMIN)
- `DELETE /api/orgs/{orgId}/projects/{projectId}` - Delete project (ADMIN)

### Tasks
- `GET /api/orgs/{orgId}/projects/{projectId}/tasks` - List tasks
- `POST /api/orgs/{orgId}/projects/{projectId}/tasks` - Create task
- `PATCH /api/orgs/{orgId}/projects/{projectId}/tasks/{taskId}` - Update task
- `DELETE /api/orgs/{orgId}/projects/{projectId}/tasks/{taskId}` - Delete task

### Files
- `GET /api/orgs/{orgId}/projects/{projectId}/files` - List files
- `POST /api/orgs/{orgId}/projects/{projectId}/files` - Upload file

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The access token is returned during login and registration. Use the `/api/auth/refresh` endpoint with your refresh token (sent as an HTTP-only cookie) to get a new access token when it expires.

## Health Check

Check API status:
```
GET /health
```

Returns: `{ "status": "ok" }`
