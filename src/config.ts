import { config } from "dotenv";
import { resolve } from "path";
import { ENV } from "./config/env.config";

switch (process.env.NODE_ENV) {
  case ENV.LOCAL:
  default:
    config({
      path: resolve(__dirname, "../.env"),
    });
    console.info(`Loaded environment: ${ENV.LOCAL}`);
    break;
  case ENV.DEVELOPMENT:
  case ENV.STAGING:
  case ENV.PRODUCTION:
    config({
      path: resolve(__dirname, `./${process.env.NODE_ENV}.env`),
    });
    console.info(`Loaded environment: ${ENV.DEVELOPMENT}`);
    break;
}
