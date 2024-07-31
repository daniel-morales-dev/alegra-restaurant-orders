import { Get, JsonController } from "routing-controllers";

@JsonController("/v1/health")
export class HealthController {
  @Get("/")
  getServerStatus() {
    return {
      message: "Server is running!",
    };
  }
}
