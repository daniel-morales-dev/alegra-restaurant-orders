import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@JsonController("/v1/health")
@Service()
export class HealthController {
  @Get("/")
  getServerStatus() {
    return {
      message: "Server is running!",
    };
  }
}
