import http from "http";
import WebSocket from "ws";
import app from "../app";

class WebSocketServer {
  private static instance: WebSocketServer;
  private wss: WebSocket.Server;

  private constructor(server: http.Server) {
    this.wss = new WebSocket.Server({ server });
  }

  public static initialize(server: http.Server): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer(server);
    }
    return WebSocketServer.instance;
  }

  public static getInstance(): WebSocketServer {
    if (!WebSocketServer.instance) {
      throw new Error("WebSocketServer is not initialized.");
    }
    return WebSocketServer.instance;
  }

  public broadcast(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

const server = http.createServer(app);
WebSocketServer.initialize(server);

export default WebSocketServer;
