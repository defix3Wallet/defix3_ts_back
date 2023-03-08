import "dotenv/config";
import "reflect-metadata";
import AppDataSource from "./config/dataSource";
import * as http from "http";
import * as https from "https";
import dbConnect from "./config/postgres";
import App from "./app";
import socketIo from "socket.io";
import NodeCache from "node-cache";
const nodeCache = new NodeCache();
const fs = require("fs");

class Server {
  private app = App;
  private port: number = Number(process.env.PORT) || 3000;
  private server!: http.Server | https.Server;
  public io!: socketIo.Server;

  constructor() {
    this.initTypeORM();
    this.connectDatabase();
    this.listen();
    this.initWebSockets();
  }

  private initTypeORM() {
    AppDataSource.initialize()
      .then(() => {
        console.log("TypeORM Ready");
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  private connectDatabase() {
    dbConnect().then(() => console.log("connection DB Ready"));
  }

  private initWebSockets() {
    this.io = new socketIo.Server(this.server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket: socketIo.Socket) => {
      console.log("User APP " + socket.id + " connected");

      if (nodeCache.has("getRanking")) {
        const data = nodeCache.get("getRanking");
        this.io.emit("getRanking", data);
      }
    });
  }

  public listen() {
    if (process.env.NODE_ENV === "production") {
      const credentials = {
        key: fs.readFileSync(
          "/etc/letsencrypt/live/defix3.com/privkey.pem",
          "utf8"
        ),
        cert: fs.readFileSync(
          "/etc/letsencrypt/live/defix3.com/cert.pem",
          "utf8"
        ),
        ca: fs.readFileSync(
          "/etc/letsencrypt/live/defix3.com/chain.pem",
          "utf8"
        ),
      };
      this.server = https.createServer(credentials, this.app);
    } else {
      this.server = http.createServer(this.app);
    }
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

new Server();
