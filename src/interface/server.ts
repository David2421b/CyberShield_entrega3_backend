import { app } from "./app";
import { prisma } from "../infrastructure/database/prisma";
import { env } from "../infrastructure/config/env";

const server = app.listen(env.PORT, () => {
  console.log(`CyberShield API disponible en http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`Recibida señal ${signal}; cerrando la API.`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
