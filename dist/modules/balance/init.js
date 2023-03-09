"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceModule = void 0;
const balance_controller_1 = require("./controllers/balance.controller");
const routes_1 = require("./routes");
class BalanceModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new balance_controller_1.BalanceController());
    }
}
exports.BalanceModule = BalanceModule;
