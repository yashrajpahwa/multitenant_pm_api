import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/errors.js";

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { projectId: req.params.projectId },
  });

  res.status(200).json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "TODO",
      priority: req.body.priority || "MEDIUM",
      projectId: req.params.projectId,
      assigneeId: req.body.assigneeId,
    },
  });

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await prisma.task.update({
    where: { id: req.params.taskId },
    data: {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      assigneeId: req.body.assigneeId,
    },
  });

  res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  await prisma.task.delete({
    where: { id: req.params.taskId },
  });

  res.status(200).json({ success: true });
});
