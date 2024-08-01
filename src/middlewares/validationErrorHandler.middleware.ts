import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Middleware({ type: "after" })
@Service()
export class ValidationErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: NextFunction) {
    const { message, name, errors = [], httpCode = 500 } = error;
    response.status(httpCode).json({
      httpCode,
      message: message,
      errors,
      name,
    });
    next();
  }
}
