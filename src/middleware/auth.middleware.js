import { verifyAccessToken } from "../config/jwt.js";
import { ApiError } from "../utils/errors.js";

export const authenticate = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Missing or invalid authorization header");
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      orgId: payload.orgId,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, "Unauthorized"));
    }
  }
};
