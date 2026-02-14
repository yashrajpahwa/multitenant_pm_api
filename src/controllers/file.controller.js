import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../db/prisma.js";
import { uploadBuffer } from "../services/s3.service.js";
import { randomToken } from "../utils/crypto.js";
import { ApiError } from "../utils/errors.js";

export const listFiles = asyncHandler(async (req, res) => {
  const files = await prisma.fileUpload.findMany({
    where: { taskId: req.params.taskId },
  });

  res.status(200).json(files);
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file provided");
  }

  const filename = `$ { randomToken(8)}-${ req.file.originalname}`;
  const url = await uploadBuffer({
    key: filename,
    buffer: req.file.buffer,
    contentType: req.file.mimetype,
  });

  const file = await prisma.fileUpload.create({
    data: {
      filename: req.file.originalname,
      url,
      size: req.file.size,
      mimeType: req.file.mimetype,
      taskId: req.params.taskId,
      uploadedById: req.user.id,
    },
  });

  res.status(201).json(file);
});
