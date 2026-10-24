import express from "express";
import cors from "cors";
import { courseRouter } from "./courses/course-router";
import { authRouter } from "./auth/auth-router";
import { enrollmentRouter } from "./enrollments/enrollment-router";
import { errorHandler } from "./http/error-handler";
import { notFound } from "./http/not-found";
import { env } from "../infrastructure/config/env";

export const app = express();

app.disable("x-powered-by");
const localFrontendOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const allowedOrigins = localFrontendOrigins.includes(env.FRONTEND_URL)
  ? localFrontendOrigins
  : [env.FRONTEND_URL];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cybershield-api" });
});
app.use("/api/auth", authRouter);
app.use("/api/cursos", courseRouter);
app.use("/api/inscripciones", enrollmentRouter);
app.use(notFound);
app.use(errorHandler);
