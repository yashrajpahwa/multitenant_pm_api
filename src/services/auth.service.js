import argon2 from "argon2";
import prisma from "../db/prisma.js";
import { ApiError } from "../utils/errors.js";
import { hashToken, randomToken, parseDurationToMs } from "../utils/crypto.js";
import { issueTokens, rotateRefreshToken, revokeRefreshToken } from "./token.service.js";

export const registerUser = async (input) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
      },
    });

    const org = await tx.org.create({
      data: { name: input.orgName },
    });

    const membership = await tx.membership.create({
      data: {
        userId: user.id,
        orgId: org.id,
        role: "OWNER",
      },
    });

    return { user, org, membership };
  });

  const tokens = await issueTokens(result.user.id, result.org.id, result.membership.role);

  return { user: result.user, org: result.org, membership: result.membership, tokens };
};

export const loginUser = async (input) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await argon2.verify(user.passwordHash, input.password);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const membership = input.orgId
    ? await prisma.membership.findUnique({
        where: {
          userId_orgId: {
            userId: user.id,
            orgId: input.orgId,
          },
        },
      })
    : await prisma.membership.findFirst({ where: { userId: user.id } });

  if (!membership) {
    throw new ApiError(403, "No org membership found");
  }

  const tokens = await issueTokens(user.id, membership.orgId, membership.role);

  return { user, membership, tokens };
};

export const refreshSession = async (refreshToken) => {
  return rotateRefreshToken(refreshToken);
};

export const logoutSession = async (refreshToken) => {
  return revokeRefreshToken(refreshToken);
};

export const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { resetToken: null };
  }

  const token = randomToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + parseDurationToMs("1h"));

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  return { resetToken: token };
};

export const confirmPasswordReset = async (resetToken, newPassword) => {
  const token = resetToken;
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });

    await tx.passwordResetToken.deleteMany({
      where: { userId: record.userId },
    });
  });

  return { success: true };
};
