import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { ApiError } from "../utils/errors.js";
import { env } from "../config/env.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    orgName: req.body.orgName,
  });

  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.tokens.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    domain: env.COOKIE_DOMAIN,
  });

  res.status(201).json({
    user: result.user,
    org: result.org,
    accessToken: result.tokens.accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser({
    email: req.body.email,
    password: req.body.password,
    orgId: req.body.orgId,
  });

  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.tokens.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    domain: env.COOKIE_DOMAIN,
  });

  res.status(200).json({
    user: result.user,
    membership: result.membership,
    accessToken: result.tokens.accessToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token");
  }

  const result = await authService.refreshSession(refreshToken);

  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    domain: env.COOKIE_DOMAIN,
  });

  res.status(200).json({
    accessToken: result.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME];
  if (refreshToken) {
    await authService.logoutSession(refreshToken);
  }

  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, {
    domain: env.COOKIE_DOMAIN,
  });

  res.status(200).json({ success: true });
});

export const passwordResetRequest = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);
  if (!result.resetToken) {
    return res.status(200).json({
      message: "If email exists, reset token has been sent",
    });
  }

  res.status(200).json({
    resetToken: result.resetToken,
  });
});

export const passwordResetConfirm = asyncHandler(async (req, res) => {
  await authService.confirmPasswordReset(req.body.resetToken, req.body.newPassword);
  res.status(200).json({ success: true });
});
