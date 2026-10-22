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
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cybershield-api" });
});
app.use("/api/auth", authRouter);
app.use("/api/cursos", courseRouter);
app.use("/api/inscripciones", enrollmentRouter);
app.use(notFound);
app.use(errorHandler);
