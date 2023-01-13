import { ApiError } from "@/helpers/api-erros";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message =
    error.statusCode != null ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
  return next()
};
