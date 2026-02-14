# SaaS Project Management API

This API provides multi-tenant orgs, projects, tasks, file uploads, and secure auth with rotating refresh tokens.

> This is just a side project to refine my backend skills. It's not production-ready and may have security issues. Use at your own risk.

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

## Database Schema

View the Entity Relationship Diagram to understand the database structure:

![ERD Diagram](./docs/images/erd.html)

Or open the interactive diagram in your browser:
```
open ./docs/images/erd.html
```

## API Documentation

API documentation is available via Swagger UI when the server is running:

```
http://localhost:3002/api-docs
```

For more details, see [SWAGGER.md](./SWAGGER.md).

## Features

- **Multi-tenant architecture** with organizations and role-based access control (OWNER, ADMIN, MEMBER)
- **Authentication** with JWT access tokens and rotating refresh tokens with reuse detection
- **File uploads** to S3-compatible storage
- **Project and task management** with status tracking and assignments
- **Rate limiting** and security headers
- **Error handling** with custom API error class and Zod validation
