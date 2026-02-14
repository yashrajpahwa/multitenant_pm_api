import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SaaS Project Management API",
      version: "1.0.0",
      description: "Multi-tenant project management API with role-based access control, authentication, file uploads, and team collaboration features.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Access Token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Organization: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Membership: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            orgId: { type: "string" },
            role: { type: "string", enum: ["OWNER", "ADMIN", "MEMBER"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            orgId: { type: "string" },
            createdById: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
            projectId: { type: "string" },
            assigneeId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        FileUpload: {
          type: "object",
          properties: {
            id: { type: "string" },
            filename: { type: "string" },
            url: { type: "string" },
            size: { type: "number" },
            mimeType: { type: "string" },
            taskId: { type: "string" },
            uploadedById: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            details: { type: "object" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
