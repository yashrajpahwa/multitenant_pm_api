import { env } from "../config/env.js";
import prisma from "../db/prisma.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../config/jwt.js";
import { hashToken, parseDurationToMs, randomToken } from "../utils/crypto.js";
import { ApiError } from "../utils/errors.js";

export const issueTokens = async (userId, orgId, role) => {
  const jti = randomToken(16);
  const refreshToken = signRefreshToken({ sub: userId, orgId, jti });
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_TTL));

  await prisma.refreshToken.create({
    data: {
      userId,
      orgId,
      jti,
      tokenHash,
      expiresAt,
    },
  });

  const accessToken = signAccessToken({ sub: userId, orgId, role });

  return { accessToken, refreshToken, refreshTokenExpiresAt: expiresAt };
};

export const rotateRefreshToken = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  const record = await prisma.refreshToken.findUnique({
    where: { jti: payload.jti },
  });

  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token is invalid");
  }

  const hashed = hashToken(refreshToken);
  if (hashed !== record.tokenHash) {
    await prisma.refreshToken.updateMany({
      where: { userId: record.userId },
      data: { revokedAt: new Date() },
    });
    throw new ApiError(401, "Refresh token reuse detected");
  }

  await prisma.refreshToken.update({
    where: { jti: record.jti },
    data: { revokedAt: new Date() },
  });

  const membership = payload.orgId
    ? await prisma.membership.findUnique({
        where: {
          userId_orgId: {
            userId: record.userId,
            orgId: payload.orgId,
          },
        },
      })
    : null;

  return issueTokens(record.userId, payload.orgId, membership?.role);
};

export const revokeRefreshToken = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { jti: payload.jti, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};
