import { Prisma } from "@prisma/client";
import { AppError } from "../../domain/errors/app-error";

export function mapPrismaError(error: unknown): AppError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;

  if (error.code === "P2025") return new AppError("El recurso solicitado no existe.", 404);
  if (error.code === "P2002") return new AppError("Ya existe un registro con esos datos.", 409);
  if (error.code === "P2003") return new AppError("La referencia a otro registro no es válida.", 400);

  return null;
}
