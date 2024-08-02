import { IWorker } from "../interfaces/queuesToSubscribe.interface";
import { Service } from "typedi";
import RedisClient from "../redis/redis.client";
import { IReceiveOrderFinished } from "../interfaces/messages/receiveOrderFinished.interface";
import serverAmqp from "../amqp/server.amqp";
import { OrdersRepository } from "../repositories/orders.repository";
import { NotFoundError } from "routing-controllers";

@Service()
export class ReceiveOrderFinishedWorker implements IWorker {
  private redisClient: RedisClient;

  constructor(private readonly orderRepository: OrdersRepository) {
    this.redisClient = RedisClient.getInstance();
  }

  async run(message: string, ack: () => void) {
    const msg: IReceiveOrderFinished = JSON.parse(message);
    try {
      const { keyRedis, uuid, status, recipe } = msg;
      console.info(`[INFO] Order ${uuid} finished`);

      await this.redisClient.set(
        keyRedis,
        { ...msg, status: "finished" },
        3600,
      );

      const order = await this.orderRepository.findOne({ where: { uuid } });

      if (!order) throw new NotFoundError("Order not found");

      order.status = "finished";
      order.recipe = recipe;

      await this.orderRepository.save(order);

      console.log("Message processed successfully", msg.uuid);
      ack();
    } catch (exception) {
      console.error("ERROR: RegisterOrderWorker.run", exception);
      await serverAmqp.sendToQueue("error_queue", {
        error: exception,
        originalMessage: message,
      });
    }
  }
}
