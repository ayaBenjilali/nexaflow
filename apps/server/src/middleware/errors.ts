import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/http.js";
export const notFound: ErrorRequestHandler = (_err, _req, _res, next) => next();
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const apiError = err instanceof ApiError ? err : new ApiError(500, "Something went wrong", "INTERNAL_ERROR");
  res.status(apiError.status).json({ success: false, error: { message: apiError.message, code: apiError.code, details: apiError.details } });
};