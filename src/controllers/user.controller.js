import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/prisma.js";

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  res.status(200).json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: req.body.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  res.status(200).json(user);
});
