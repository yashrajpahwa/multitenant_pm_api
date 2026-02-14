import express from "express";
import authRoutes from "./auth.routes.js";
import orgRoutes from "./org.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import fileRoutes from "./file.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/orgs", orgRoutes);
router.use("/orgs/:orgId/projects", projectRoutes);
router.use("/orgs/:orgId/projects/:projectId/tasks", taskRoutes);
router.use("/orgs/:orgId/projects/:projectId/files", fileRoutes);
router.use("/users", userRoutes);

export default router;
