"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const dataSource_1 = __importDefault(require("./config/dataSource"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const postgres_1 = __importDefault(require("./config/postgres"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = __importDefault(require("socket.io"));
const node_cache_1 = __importDefault(require("node-cache"));
const nodeCache = new node_cache_1.default();
const fs = require("fs");
class Server {
    constructor() {
        this.app = app_1.default;
        this.port = Number(process.env.PORT) || 3000;
        this.initTypeORM();
        this.connectDatabase();
        this.listen();
        this.initWebSockets();
    }
    initTypeORM() {
        dataSource_1.default.initialize()
            .then(() => {
            console.log("TypeORM Ready");
        })
            .catch((err) => {
            console.error(err);
        });
    }
    connectDatabase() {
        (0, postgres_1.default)().then(() => console.log("connection DB Ready"));
    }
    initWebSockets() {
        this.io = new socket_io_1.default.Server(this.server, {
            cors: {
                origin: "*",
            },
        });
        this.io.on("connection", (socket) => {
            console.log("User APP " + socket.id + " connected");
            if (nodeCache.has("getRanking")) {
                const data = nodeCache.get("getRanking");
                this.io.emit("getRanking", data);
            }
        });
    }
    listen() {
        if (process.env.NODE_ENV === "production") {
            const credentials = {
                key: fs.readFileSync("/etc/letsencrypt/live/defix3.com/privkey.pem", "utf8"),
                cert: fs.readFileSync("/etc/letsencrypt/live/defix3.com/cert.pem", "utf8"),
                ca: fs.readFileSync("/etc/letsencrypt/live/defix3.com/chain.pem", "utf8"),
            };
            this.server = https.createServer(credentials, this.app);
        }
        else {
            this.server = http.createServer(this.app);
        }
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
new Server();
