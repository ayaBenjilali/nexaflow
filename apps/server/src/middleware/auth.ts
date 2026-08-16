import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { Role } from "@nexaflow/shared";
import { env } from "../config/env.js";
import { authRepo } from "../repositories/demoRepository.js";
import { ApiError } from "../utils/http.js";

declare global { namespace Express { interface Request { user?: { id: string; email: string; role: Role; name: string } } } }
export const signToken = (user: { id: string; email: string; role: Role; name: string }) => jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const raw = req.headers.authorization?.replace("Bearer ", "");
  if (!raw) return next(new ApiError(401, "Authentication required", "UNAUTHORIZED"));
  try {
    const payload = jwt.verify(raw, env.jwtSecret) as any;
    const user = authRepo.findUser(payload.id);
    if (!user) throw new Error("missing user");
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch { next(new ApiError(401, "Session expired. Please sign in again.", "SESSION_EXPIRED")); }
};
export const requireRole = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => req.user && roles.includes(req.user.role) ? next() : next(new ApiError(403, "You do not have permission to perform this action.", "FORBIDDEN"));
