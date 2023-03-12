"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferController = void 0;
const transfer_service_1 = require("../services/transfer.service");
class TransferController {
    constructor() {
        this.transferService = new transfer_service_1.TransferService();
    }
}
exports.TransferController = TransferController;
