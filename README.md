# SaaS Project Management API

This API provides multi-tenant orgs, projects, tasks, file uploads, and secure auth with rotating refresh tokens.

## Setup

1. Copy `.env.example` to `.env` and fill in MongoDB Atlas and S3-compatible credentials.
2. Install dependencies:

```
npm install
```

3. Generate Prisma client and push schema:

```
npm run prisma:generate
npm run prisma:push
```

4. Start the API:

```
npm run dev
```

## Auth flows

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Refresh: `POST /api/auth/refresh`
- Logout: `POST /api/auth/logout`
- Password reset: `POST /api/auth/password-reset/request` then `POST /api/auth/password-reset/confirm`

The password reset request response returns a `resetToken` for development. Replace with email delivery in production.

## File upload

Upload a file with `multipart/form-data` using field name `file`:

`POST /api/orgs/:orgId/projects/:projectId/files`
