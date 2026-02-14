import express from "express";
import * as projectController from "../controllers/project.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireMembership, requireRole } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(requireMembership);

/**
 * @swagger
 * /api/orgs/{orgId}/projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects in organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/", projectController.listProjects);

/**
 * @swagger
 * /api/orgs/{orgId}/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create project (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.post("/", requireRole("ADMIN"), projectController.createProject);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 */
router.get("/:projectId", projectController.getProject);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}:
 *   patch:
 *     tags: [Projects]
 *     summary: Update project (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 */
router.patch("/:projectId", requireRole("ADMIN"), projectController.updateProject);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.delete("/:projectId", requireRole("ADMIN"), projectController.deleteProject);

export default router;
