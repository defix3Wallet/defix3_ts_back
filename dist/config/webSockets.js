"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const node_cache_1 = __importDefault(require("node-cache"));
const nodeCache = new node_cache_1.default();
class WebSocketServer {
    constructor(httpServer) {
        this.io = new socket_io_1.default.Server(httpServer);
        this.setup();
    }
    setup() {
        this.io.on("connection", (socket) => {
            console.log("User APP " + socket.id + " connected");
            if (nodeCache.has("getRanking")) {
                const data = nodeCache.get("getRanking");
                this.io.emit("getRanking", data);
            }
        });
    }
}
exports.default = WebSocketServer;
