import type { RequestHandler } from "express";

export function asyncHandler(controller: RequestHandler): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(controller(req, res, next)).catch(next);
  };
}
