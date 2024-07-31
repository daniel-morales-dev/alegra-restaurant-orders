import app from "../app";
import morgan from "morgan";

export default class Server {
  public port: number;
  constructor(port: number) {
    this.port = port;
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
    app.listen(this.port, callback);
  }
}
