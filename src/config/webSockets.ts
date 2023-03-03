import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { EventEmitter } from "events";
import socketIo, { Socket } from "socket.io";
import NodeCache from "node-cache";
const nodeCache = new NodeCache();

class WebSocketServer {
  public io: socketIo.Server;

  constructor(httpServer: HttpServer | HttpsServer) {
    this.io = new socketIo.Server(httpServer);
    this.setup();
  }

  public setup(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("User APP " + socket.id + " connected");

      if (nodeCache.has("getRanking")) {
        const data = nodeCache.get("getRanking");
        this.io.emit("getRanking", data);
      }
    });
  }
}

export default WebSocketServer;
