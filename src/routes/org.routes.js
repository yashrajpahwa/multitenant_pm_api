import express from "express";
import * as orgController from "../controllers/org.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireMembership, requireRole } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/orgs:
 *   get:
 *     tags: [Organizations]
 *     summary: List user organizations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get("/", orgController.listOrgs);

/**
 * @swagger
 * /api/orgs:
 *   post:
 *     tags: [Organizations]
 *     summary: Create new organization
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Organization created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 */
router.post("/", orgController.createOrg);

/**
 * @swagger
 * /api/orgs/{orgId}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get organization details with members
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
 *         description: Organization details
 */
router.get("/:orgId", requireMembership, orgController.getOrg);

/**
 * @swagger
 * /api/orgs/{orgId}:
 *   patch:
 *     tags: [Organizations]
 *     summary: Update organization (OWNER only)
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated
 */
router.patch("/:orgId", requireMembership, requireRole("OWNER"), orgController.updateOrg);

/**
 * @swagger
 * /api/orgs/{orgId}/members:
 *   post:
 *     tags: [Organizations]
 *     summary: Add member to organization (ADMIN only)
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
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *                 default: MEMBER
 *     responses:
 *       201:
 *         description: Member added
 */
router.post("/:orgId/members", requireMembership, requireRole("ADMIN"), orgController.addMember);

/**
 * @swagger
 * /api/orgs/{orgId}/members/{userId}:
 *   patch:
 *     tags: [Organizations]
 *     summary: Update member role (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/:orgId/members/:userId", requireMembership, requireRole("ADMIN"), orgController.updateMemberRole);

/**
 * @swagger
 * /api/orgs/{orgId}/members/{userId}:
 *   delete:
 *     tags: [Organizations]
 *     summary: Remove member from organization (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete("/:orgId/members/:userId", requireMembership, requireRole("ADMIN"), orgController.removeMember);

export default router;
