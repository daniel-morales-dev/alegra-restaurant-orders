import app from "../app";
import morgan from "morgan";
import http from "http";
import WebSocketServer from "./webSocket";

export default class Server {
  public port: number;
  private readonly server: http.Server;

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer(app);
    WebSocketServer.initialize(this.server);
  }

  static init(port: number) {
    return new Server(port);
  }

  start(callback: () => void) {
    app.use(
      morgan(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" STATUS=:status :res[content-length] ":referrer" ":user-agent"',
      ),
    );
    app.disable("x-powered-by");
    this.server.listen(this.port, callback);
  }
}
