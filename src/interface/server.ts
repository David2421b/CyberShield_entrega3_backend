import { app } from "./app";
import { prisma } from "../infrastructure/database/prisma";

const port = Number(process.env.PORT ?? 4000);
const server = app.listen(port, () => {
  console.log(`CyberShield API disponible en http://localhost:${port}`);
});

function shutdown(signal: string) {
  console.log(`Recibida señal ${signal}; cerrando la API.`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
