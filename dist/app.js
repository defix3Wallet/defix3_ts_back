"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const init_1 = require("./modules/users/init");
const init_2 = require("./modules/wallets/init");
const init_3 = require("./modules/address/init");
const init_4 = require("./modules/balance/init");
const init_5 = require("./modules/subscription/init");
const init_6 = require("./modules/general/init");
const init_7 = require("./modules/transactionHistory/init");
const init_8 = require("./modules/transfer/init");
const init_9 = require("./modules/frequent/init");
const init_10 = require("./modules/swap/init");
const init_11 = require("./modules/orderLimit/init");
const init_12 = require("./modules/withdraw/init");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.router = express_1.default.Router();
        this.config();
        this.initModules();
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use((0, morgan_1.default)("dev"));
            this.app.use((0, cors_1.default)());
            this.app.use(express_1.default.json());
            this.app.use("/api/v2", this.router);
            this.app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
            this.app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
        });
    }
    initModules() {
        new init_3.AddressModule(this.router);
        new init_2.WalletsModule(this.router);
        new init_1.UsersModule(this.router);
        new init_4.BalanceModule(this.router);
        new init_5.SubscriptionModule(this.router);
        new init_6.GeneralModule(this.router);
        new init_7.TransactionHistoryModule(this.router);
        new init_8.TransferModule(this.router);
        new init_12.WithdrawModule(this.router);
        new init_10.SwapModule(this.router);
        new init_11.LimitOrderModule(this.router);
        new init_9.FrequentModule(this.router);
    }
}
exports.default = new App().app;
