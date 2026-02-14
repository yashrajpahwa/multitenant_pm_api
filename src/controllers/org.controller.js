import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/errors.js";

export const listOrgs = asyncHandler(async (req, res) => {
  const orgs = await prisma.org.findMany({
    where: {
      memberships: {
        some: {
          userId: req.user.id,
        },
      },
    },
  });

  res.status(200).json(orgs);
});

export const createOrg = asyncHandler(async (req, res) => {
  const org = await prisma.org.create({
    data: { name: req.body.name },
  });

  await prisma.membership.create({
    data: {
      userId: req.user.id,
      orgId: org.id,
      role: "OWNER",
    },
  });

  res.status(201).json(org);
});

export const getOrg = asyncHandler(async (req, res) => {
  const org = await prisma.org.findUnique({
    where: { id: req.params.orgId },
    include: {
      memberships: {
        include: { user: { select: { id: true, email: true, name: true } } },
      },
    },
  });

  if (!org) {
    throw new ApiError(404, "Organization not found");
  }

  res.status(200).json(org);
});

export const updateOrg = asyncHandler(async (req, res) => {
  const org = await prisma.org.update({
    where: { id: req.params.orgId },
    data: { name: req.body.name },
  });

  res.status(200).json(org);
});

export const addMember = asyncHandler(async (req, res) => {
  const existing = await prisma.membership.findUnique({
    where: {
      userId_orgId: {
        userId: req.body.userId,
        orgId: req.params.orgId,
      },
    },
  });

  if (existing) {
    throw new ApiError(409, "User already a member");
  }

  const membership = await prisma.membership.create({
    data: {
      userId: req.body.userId,
      orgId: req.params.orgId,
      role: req.body.role || "MEMBER",
    },
  });

  res.status(201).json(membership);
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const membership = await prisma.membership.update({
    where: {
      userId_orgId: {
        userId: req.params.userId,
        orgId: req.params.orgId,
      },
    },
    data: { role: req.body.role },
  });

  res.status(200).json(membership);
});

export const removeMember = asyncHandler(async (req, res) => {
  await prisma.membership.delete({
    where: {
      userId_orgId: {
        userId: req.params.userId,
        orgId: req.params.orgId,
      },
    },
  });

  res.status(200).json({ success: true });
});
