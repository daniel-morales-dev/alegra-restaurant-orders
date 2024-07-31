import { Service } from "typedi";
import { IWorker } from "../interfaces/queuesToSubscribe.interface";

@Service()
export class RegisterOrderWorker implements IWorker {
  async run(message: string, ack: () => void) {
    const msg = JSON.parse(message);
    try {
      console.log("Processing message:", msg);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      console.log("Message processed successfully", msg.data.uuid);
      ack();
    } catch (exception) {
      console.error("ERROR: RegisterOrderWorker.run", exception);
      throw exception;
    }
  }
}
