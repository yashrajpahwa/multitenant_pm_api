import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/errors.js";

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { orgId: req.params.orgId },
  });

  res.status(200).json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      orgId: req.params.orgId,
      createdById: req.user.id,
    },
  });

  res.status(201).json(project);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.projectId },
    include: {
      createdBy: { select: { id: true, email: true, name: true } },
      tasks: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.status(200).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.update({
    where: { id: req.params.projectId },
    data: {
      name: req.body.name,
      description: req.body.description,
    },
  });

  res.status(200).json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  await prisma.project.delete({
    where: { id: req.params.projectId },
  });

  res.status(200).json({ success: true });
});
