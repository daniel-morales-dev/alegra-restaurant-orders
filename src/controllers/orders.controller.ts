import { Body, JsonController, Post } from "routing-controllers";
import serverAmqp from "../amqp/server.amqp";
import { Service } from "typedi";
import { v4 } from "uuid";
import { QUEUES } from "../amqp/queues.amqp";
import RedisClient from "../redis/redis.client";

@JsonController("/v1/orders")
@Service()
export class OrdersController {
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = RedisClient.getInstance();
  }
  @Post("/register")
  async registerOrder(@Body() body: any) {
    const messageId = v4();
    const msg = {
      action: QUEUES.REGISTER_ORDER.NAME,
      data: { uuid: messageId, status: "pending" },
    };

    await this.redisClient.set(
      `${QUEUES.REGISTER_ORDER.NAME}:${messageId}`,
      {
        status: "pending",
        id: messageId,
      },
      10800,
    );

    await serverAmqp.sendToQueue(QUEUES.REGISTER_ORDER.NAME, msg);

    return msg;
  }
}
