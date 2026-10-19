import "dotenv/config";
import express from "express";
import cors from "cors";
import { courseRouter } from "./courses/course-router";
import { authRouter } from "./auth/auth-router";
import { errorHandler } from "./http/error-handler";
import { notFound } from "./http/not-found";

export const app = express();

const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:3000";

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cybershield-api" });
});
app.use("/api/auth", authRouter);
app.use("/api/cursos", courseRouter);
app.use(notFound);
app.use(errorHandler);
