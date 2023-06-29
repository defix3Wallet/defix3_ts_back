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
// import NodeCache from "node-cache";
const index_1 = require("./process/index");
const cacheConfig_1 = require("./config/cacheConfig");
// const nodeCache = new NodeCache();
const fs = require("fs");
const glob = __importStar(require("glob"));
const adminjs_1 = __importDefault(require("adminjs"));
const express_1 = __importDefault(require("@adminjs/express"));
const path_1 = __importDefault(require("path"));
const AdminJSTypeorm = __importStar(require("@adminjs/typeorm"));
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
            .then(async () => {
            console.log("TypeORM Ready");
            this.initAdminJs();
        })
            .catch((err) => {
            console.error(err);
        });
    }
    initAdminJs() {
        adminjs_1.default.registerAdapter({
            Resource: AdminJSTypeorm.Resource,
            Database: AdminJSTypeorm.Database,
        });
        const entityFiles = glob.sync(path_1.default.join(__dirname, "modules", "**", "*.entity.{ts,js}"));
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
        const admin = new adminjs_1.default(adminOptions);
        const DEFAULT_ADMIN = {
            email: process.env.EMAIL_ADMINJS,
            password: process.env.PASSWORD_ADMINJS,
        };
        const secret = process.env.SECRET_ADMINJS;
        const authenticate = async (email, password) => {
            console.log(email, password);
            if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
                return { email: DEFAULT_ADMIN.email };
            }
        };
        const adminRouter = express_1.default.buildAuthenticatedRouter(admin, {
            authenticate,
            cookiePassword: "very_secret_secret",
        }, null, {
            resave: true,
            saveUninitialized: true,
            secret,
        });
        this.app.use(admin.options.rootPath, adminRouter);
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
            if (cacheConfig_1.CacheConfig.nodeCache.has("getRanking")) {
                const data = cacheConfig_1.CacheConfig.nodeCache.get("getRanking");
                // const data = nodeCache.get("getRanking");
                this.io.emit("getRanking", data);
            }
        });
        (0, index_1.startProcess)(this.io);
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
