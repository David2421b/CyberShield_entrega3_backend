import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "../../domain/errors/app-error";
import type { UserRole } from "../../domain/auth/auth-user";
import { env } from "../../infrastructure/config/env";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

function isAuthPayload(payload: string | JwtPayload): payload is JwtPayload & AuthenticatedUser {
  return typeof payload !== "string"
    && typeof payload.id === "string"
    && (payload.role === "admin" || payload.role === "user");
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Se requiere autenticación.", 401));
    return;
  }

  try {
    const payload = jwt.verify(authorization.slice(7), env.JWT_SECRET);
    if (!isAuthPayload(payload)) {
      next(new AppError("El token no es válido.", 401));
      return;
    }
    req.authUser = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError("El token no es válido o ha expirado.", 401));
  }
};
