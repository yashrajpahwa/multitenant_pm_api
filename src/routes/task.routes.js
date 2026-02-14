import express from "express";
import * as taskController from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireMembership } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(requireMembership);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks in project
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
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", taskController.listTasks);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
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
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               assigneeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post("/", taskController.createTask);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}/tasks/{taskId}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update task
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
 *       - in: path
 *         name: taskId
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch("/:taskId", taskController.updateTask);

/**
 * @swagger
 * /api/orgs/{orgId}/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:taskId", taskController.deleteTask);

export default router;
