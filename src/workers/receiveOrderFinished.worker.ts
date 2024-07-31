import { IWorker } from "../interfaces/queuesToSubscribe.interface";
import { Service } from "typedi";
import WebSocketServer from "../server/webSocket";
import RedisClient from "../redis/redis.client";
import { IReceiveOrderFinished } from "../interfaces/messages/receiveOrderFinished.interface";

@Service()
export class ReceiveOrderFinishedWorker implements IWorker {
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = RedisClient.getInstance();
  }

  async run(message: string, ack: () => void) {
    const msg: IReceiveOrderFinished = JSON.parse(message);
    try {
      const { keyRedis } = msg;
      console.info(`[INFO] Order ${msg.uuid} finished`);

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

      console.log("Message processed successfully", msg.uuid);
      ack();
    } catch (exception) {
      console.error("ERROR: RegisterOrderWorker.run", exception);
      throw exception;
    }
  }
}
