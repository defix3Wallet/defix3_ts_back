"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHistoryModule = void 0;
const transactionHistory_controller_1 = require("./controllers/transactionHistory.controller");
const routes_1 = require("./routes");
class TransactionHistoryModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new transactionHistory_controller_1.TransactionHistoryController());
    }
}
exports.TransactionHistoryModule = TransactionHistoryModule;
