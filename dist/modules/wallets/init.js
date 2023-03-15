"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsModule = void 0;
const wallet_controller_1 = require("./controllers/wallet.controller");
const routes_1 = require("./routes");
class WalletsModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new wallet_controller_1.WalletController());
    }
}
exports.WalletsModule = WalletsModule;
