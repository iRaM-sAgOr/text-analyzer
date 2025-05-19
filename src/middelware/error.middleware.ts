import { Request, Response, NextFunction } from "express";


export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    // console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    })
}

export class AppError extends Error {
  statusCode: number;
  errorData?: object;

  constructor(message: string, statusCode = 500, errorData?: object) {
    super(message);
    this.statusCode = statusCode;
    this.errorData = errorData;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}