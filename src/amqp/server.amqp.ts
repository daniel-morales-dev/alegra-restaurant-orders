import client, { Connection, Channel } from "amqplib";
import { AMQP_URL } from "../config/app.config";
import Container, { Service } from "typedi";
import { QUEUE_LIST } from "./queues.amqp";

type HandlerCB = (msg: string) => any;

@Service()
class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(AMQP_URL);

      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log(`🛸 Created RabbitMQ Channel successfully`);

      this.connected = true;
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async consume(
    handleIncomingNotification: HandlerCB,
    queueName: string,
  ): Promise<void> {
    await this.channel.assertQueue(queueName, {
      durable: true,
    });

    this.channel.consume(
      queueName,
      (msg) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          handleIncomingNotification(msg?.content?.toString());
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      },
    );
  }

  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async initializeSubscription() {
    for (const queue of QUEUE_LIST) {
      const handlerInstance = Container.get(queue.HANDLER);
      await this.consume((msg: string) => handlerInstance.run(msg), queue.NAME);
      console.info(`Subscribed to queue: ${queue.NAME}`);
    }
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
