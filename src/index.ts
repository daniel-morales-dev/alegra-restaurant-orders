import "./config";
import Server from "./server/server";
import amqpServer from "./amqp/server.amqp";
import Container from "typedi";
import { useContainer as routeContainer } from "routing-controllers";

routeContainer(Container);

export const server = Server.init(process.env.PORT as unknown as number);

server.start(async () => {
  console.info(`Server started at PORT ${process.env.PORT}`);
  await amqpServer.connect();
  await amqpServer.initializeSubscription();
});
