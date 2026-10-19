import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../../domain/errors/app-error";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  if (error instanceof ZodError) {
    res.status(400).json({ error: "La solicitud contiene datos inválidos.", details: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "El recurso solicitado no existe." });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({ error: "Ya existe un registro con esos datos." });
      return;
    }
    if (error.code === "P2003") {
      res.status(400).json({ error: "La referencia a otro registro no es válida." });
      return;
    }
  }
  console.error("Error inesperado en la API:", error instanceof Error ? error.message : "Error desconocido");
  res.status(500).json({ error: "Ocurrió un error interno." });
};
