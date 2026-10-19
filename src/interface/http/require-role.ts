import type { RequestHandler } from "express";
import { AppError } from "../../domain/errors/app-error";
import type { UserRole } from "../../domain/auth/auth-user";

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.authUser) {
      next(new AppError("Se requiere autenticación.", 401));
      return;
    }
    if (!allowedRoles.includes(req.authUser.role)) {
      next(new AppError("No tienes permisos para realizar esta acción.", 403));
      return;
    }
    next();
  };
}

export const requireAdmin = requireRole("admin");
