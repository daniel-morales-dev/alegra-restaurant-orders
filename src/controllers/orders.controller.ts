import { Body, Get, JsonController, Post } from "routing-controllers";
import serverAmqp from "../amqp/server.amqp";
import { Service } from "typedi";
import { v4 } from "uuid";
import { QUEUES } from "../amqp/queues.amqp";

@JsonController("/v1/orders")
@Service()
export class OrdersController {
  @Post("/register")
  async registerOrder(@Body() body: any) {
    const { uuid } = body;
    console.log("Register order...");
    const msg = {
      action: QUEUES.REGISTER_ORDER,
      data: { uuid: v4(), status: "process" },
    };
    console.log("MSG", msg);
    await serverAmqp.sendToQueue(QUEUES.REGISTER_ORDER, JSON.stringify(msg));

    return {
      message: "Queued",
    };
  }
}
