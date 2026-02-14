import express from "express";
import multer from "multer";
import * as fileController from "../controllers/file.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireMembership } from "../middleware/rbac.middleware.js";
import { env } from "../config/env.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: env.UPLOAD_MAX_BYTES } });

router.use(authenticate);
router.use(requireMembership);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}/files:
 *   get:
 *     tags: [Files]
 *     summary: List files in task
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
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileUpload'
 */
router.get("/", fileController.listFiles);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}/files:
 *   post:
 *     tags: [Files]
 *     summary: Upload file
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUpload'
 */
router.post("/", upload.single("file"), fileController.uploadFile);

export default router;
