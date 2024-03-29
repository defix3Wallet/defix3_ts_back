import "dotenv/config";
import "reflect-metadata";
import AppDataSource from "./config/dataSource";
import * as http from "http";
import * as https from "https";
import dbConnect from "./config/postgres";
import App from "./app";
import socketIo from "socket.io";
// import NodeCache from "node-cache";
import { startProcess } from "./process/index";
import { CacheConfig } from "./config/cacheConfig";
// const nodeCache = new NodeCache();
const fs = require("fs");

import * as glob from "glob";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import path from "path";
import * as AdminJSTypeorm from "@adminjs/typeorm";

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
      .then(async () => {
        console.log("TypeORM Ready");
        this.initAdminJs();
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  private initAdminJs() {
    AdminJS.registerAdapter({
      Resource: AdminJSTypeorm.Resource,
      Database: AdminJSTypeorm.Database,
    });

    const entityFiles = glob.sync(path.join(__dirname, "modules", "**", "*.entity.{ts,js}"));

    const entities = entityFiles.map((file) => {
      const entityModule = require(file);
      const entity = Object.values(entityModule)[0];
      return entity;
    });

    const adminOptions = {
      resources: entities,
      branding: {
        companyName: "Admin DeFix3",
        softwareBrothers: false,
        // logo: false, // OR false to hide the default one
      },
    };

    const admin = new AdminJS(adminOptions);

    const DEFAULT_ADMIN = {
      email: process.env.EMAIL_ADMINJS,
      password: process.env.PASSWORD_ADMINJS,
    };

    const secret = process.env.SECRET_ADMINJS;

    const authenticate = async (email: string, password: string) => {
      console.log(email, password);
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return { email: DEFAULT_ADMIN.email };
      }
    };

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookiePassword: "very_secret_secret",
      },
      null,
      {
        resave: true,
        saveUninitialized: true,
        secret,
      }
    );

    this.app.use(admin.options.rootPath, adminRouter);
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

      if (CacheConfig.nodeCache.has("getRanking")) {
        const data = CacheConfig.nodeCache.get("getRanking");
        // const data = nodeCache.get("getRanking");
        this.io.emit("getRanking", data);
      }
    });

    startProcess(this.io);
  }

  public listen() {
    if (process.env.NODE_ENV === "production") {
      const credentials = {
        key: fs.readFileSync("/etc/letsencrypt/live/defix3.com/privkey.pem", "utf8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/defix3.com/cert.pem", "utf8"),
        ca: fs.readFileSync("/etc/letsencrypt/live/defix3.com/chain.pem", "utf8"),
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
