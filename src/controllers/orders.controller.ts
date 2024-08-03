import {
  Body,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers";
import serverAmqp from "../amqp/server.amqp";
import { Service } from "typedi";
import { v4 } from "uuid";
import { QUEUES } from "../amqp/queues.amqp";
import RedisClient from "../redis/redis.client";
import { IProcessOrderMessage } from "../interfaces/messages/processOrderMessage.interface";
import { OrderService } from "../services/order.service";

@JsonController("/v1/orders")
@Service()
export class OrdersController {
  private redisClient: RedisClient;
  private orderQueue: Array<{ uuid: string; status: string }> = [];
  private readonly BATCH_SIZE = 10;
  private readonly PROCESS_INTERVAL = 5000; // 5 seconds

  constructor(private readonly orderService: OrderService) {
    this.redisClient = RedisClient.getInstance();
    this.startOrderProcessing();
  }

  @Post("/register")
  async registerOrder() {
    const messageId = v4();
    const newOrder = {
      uuid: messageId,
      status: "pending",
    };

    this.orderQueue.push(newOrder);

    return newOrder;
  }

  @Get("/status")
  async getOrderStatuses(
    @QueryParam("uuids", { isArray: true, type: String }) uuids: string[],
  ) {
    return this.orderService.getMultipleStatusOrder(uuids);
  }

  @Get("/today")
  async getOrderToday() {
    return this.orderService.getTodayOrders();
  }

  private startOrderProcessing() {
    setInterval(async () => {
      if (this.orderQueue.length === 0) return;

      const ordersToProcess = this.orderQueue.splice(0, this.BATCH_SIZE);

      try {
        const redisPromises = ordersToProcess.map((order) =>
          this.redisClient.set(
            `${QUEUES.REGISTER_ORDER.NAME}:${order.uuid}`,
            { status: "pending", id: order.uuid },
            10800,
          ),
        );

        const dbPromises = ordersToProcess.map((order) =>
          this.orderService.createOrder({
            uuid: order.uuid,
            status: "pending",
          }),
        );

        const amqpPromises = ordersToProcess.map((order) =>
          serverAmqp.sendToQueue<IProcessOrderMessage>(
            QUEUES.REGISTER_ORDER.NAME,
            {
              action: QUEUES.REGISTER_ORDER.NAME,
              uuid: order.uuid,
              status: "pending",
            },
          ),
        );

        await Promise.all([...redisPromises, ...dbPromises, ...amqpPromises]);
      } catch (error) {
        console.error("Error processing orders:", error);
      }
    }, this.PROCESS_INTERVAL);
  }
}
