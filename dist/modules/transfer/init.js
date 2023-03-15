"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferModule = void 0;
const transfer_controller_1 = require("./controllers/transfer.controller");
const routes_1 = require("./routes");
class TransferModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new transfer_controller_1.TransferController());
    }
}
exports.TransferModule = TransferModule;
