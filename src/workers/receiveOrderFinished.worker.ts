import { IWorker } from "../interfaces/queuesToSubscribe.interface";
import { Service } from "typedi";
import WebSocketServer from "../server/webSocket";
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
      const { keyRedis, uuid, status } = msg;
      console.info(`[INFO] Order ${uuid} finished`);

      const wsServer = WebSocketServer.getInstance();
      wsServer.broadcast(
        JSON.stringify({
          type: "ORDER_FINISHED",
          data: msg,
        }),
      );

      await this.redisClient.set(
        keyRedis,
        { ...msg, status: "finished" },
        3600,
      );

      const order = await this.orderRepository.findOne({ where: { uuid } });

      if (!order) throw new NotFoundError("Order not found");

      order.status = "finished";

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
