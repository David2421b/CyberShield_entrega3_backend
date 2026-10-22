import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL es obligatoria."),
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres."),
  JWT_EXPIRES_IN: z.string().min(1).default("1d"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`La configuración del backend no es válida:\n${issues}`);
}

export const env = result.data;
