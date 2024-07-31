// src/workers/registerOrder.worker.ts
import { Service } from "typedi";
import { Message } from "amqplib";

@Service()
export class RegisterOrderWorker {
  async run(message: string, ack: () => void) {
    const msg = JSON.parse(message);
    try {
      console.log("Processing message:", msg);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      console.log("Message processed successfully");
      ack();
    } catch (exception) {
      console.error("ERROR: RegisterOrderWorker.run", exception);
      throw exception; // Maneja el error según tu lógica
    }
  }
}
