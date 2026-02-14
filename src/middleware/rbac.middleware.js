import prisma from "../db/prisma.js";
import { ApiError } from "../utils/errors.js";

const ROLE_HIERARCHY = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

export const requireMembership = async (req, _res, next) => {
  try {
    const orgId = req.params.orgId || req.body.orgId || req.query.orgId;
    if (!orgId) {
      throw new ApiError(400, "Organization ID required");
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: req.user.id,
          orgId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(403, "Not a member of this organization");
    }

    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (minRole) => {
  return (req, _res, next) => {
    try {
      const userRole = req.membership?.role;
      if (!userRole || ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minRole]) {
        throw new ApiError(403, "Insufficient permissions");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
