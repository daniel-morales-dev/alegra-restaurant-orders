import { Body, JsonController, Post } from "routing-controllers";
import serverAmqp from "../amqp/server.amqp";
import { Service } from "typedi";
import { v4 } from "uuid";
import { QUEUES } from "../amqp/queues.amqp";

@JsonController("/v1/orders")
@Service()
export class OrdersController {
  @Post("/register")
  async registerOrder(@Body() body: any) {
    const msg = {
      action: QUEUES.REGISTER_ORDER.NAME,
      data: { uuid: v4(), status: "process" },
    };

    await serverAmqp.sendToQueue(QUEUES.REGISTER_ORDER.NAME, msg);

    return {
      message: "Queued",
    };
  }
}
