import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { resolve } from "path";
import { Application } from "express";

const app: Application = createExpressServer({
  defaultErrorHandler: false,
  classTransformer: true,
  routePrefix: "/api/orders",
  validation: {
    validationError: {
      target: false,
    },
  },
  cors: true,
  controllers: [resolve(__dirname, "./controllers/*{.ts,.js}")],
  middlewares: [resolve(__dirname, "./middlewares/*{.ts,.js}")],
});

export default app;
