import { Service } from "typedi";
import { IWorker } from "../interfaces/queuesToSubscribe.interface";
import RedisClient from "../redis/redis.client";
import serverAmqp from "../amqp/server.amqp";
import { IUpdateOrder } from "../interfaces/messages/receiveOrderFinished.interface";
import { OrdersRepository } from "../repositories/orders.repository";
import { NotFoundError } from "routing-controllers";

@Service()
export class UpdateStatusOrder implements IWorker {
  private redisClient: RedisClient;

  constructor(private readonly orderRepository: OrdersRepository) {
    this.redisClient = RedisClient.getInstance();
  }

  async run(message: string, ack: () => void) {
    const msg: IUpdateOrder = JSON.parse(message);
    try {
      const { keyRedis, uuid, status, recipe } = msg;
      console.info(`[INFO] Order ${msg.uuid} updating status`);

      const order = await this.orderRepository.findOne({
        where: {
          uuid,
        },
      });

      if (!order) throw new NotFoundError("Order not found");

      order.status = status;
      order.recipe = recipe;

      // Save new status order

      await this.orderRepository.save(order);

      await this.redisClient.set(keyRedis, { ...msg, status }, 3600);

      console.log(`[INFO] Order ${uuid} - Status updated to ${status}`);
      ack();
    } catch (err) {
      console.error("ERROR: RegisterOrderWorker.run", err);
      await serverAmqp.sendToQueue("error_queue", {
        error: err,
        originalMessage: message,
      });
    }
  }
}
