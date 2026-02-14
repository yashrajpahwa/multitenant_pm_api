import { env } from "./env.js";
import jwt from "jsonwebtoken";

export const signAccessToken = (payload) => {
  const options = {
    expiresIn: env.JWT_ACCESS_TTL,
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

export const signRefreshToken = (payload) => {
  const options = {
    expiresIn: env.JWT_REFRESH_TTL,
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
