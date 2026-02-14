import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { generalRateLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import apiRoutes from "./routes/index.js";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors({ origin: process.env.APP_URL, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Rate limiting
  app.use(generalRateLimiter);

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerSpec, { customCss: "" }));

  // API routes
  app.use("/api", apiRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
};
