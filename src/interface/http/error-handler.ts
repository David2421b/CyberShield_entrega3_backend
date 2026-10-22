import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../../domain/errors/app-error";
import { mapPrismaError } from "../../infrastructure/database/map-prisma-error";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (typeof error === "object" && error !== null && "type" in error) {
    const parserError = error as { type?: unknown };
    if (parserError.type === "entity.parse.failed") {
      res.status(400).json({ error: "El cuerpo de la solicitud no contiene JSON válido." });
      return;
    }
    if (parserError.type === "entity.too.large") {
      res.status(413).json({ error: "El cuerpo de la solicitud supera el tamaño permitido." });
      return;
    }
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  if (error instanceof ZodError) {
    res.status(400).json({ error: "La solicitud contiene datos inválidos.", details: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
    return;
  }
  const databaseError = mapPrismaError(error);
  if (databaseError) {
    res.status(databaseError.statusCode).json({ error: databaseError.message });
    return;
  }
  console.error("Error inesperado en la API:", error instanceof Error ? error.message : "Error desconocido");
  res.status(500).json({ error: "Ocurrió un error interno." });
};
