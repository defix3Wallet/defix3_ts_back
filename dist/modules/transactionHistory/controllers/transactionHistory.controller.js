"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHistoryController = void 0;
const transactionHistory_service_1 = require("../services/transactionHistory.service");
class TransactionHistoryController {
    constructor() {
        this.getTransactionHistory = async (req, res) => {
            try {
                const { defixId, blockchain, coin, hash, typeTxn } = req.body;
                const transactions = await this.transactionHistory.getTransactionHistory(defixId, coin, blockchain, hash, typeTxn);
                res.send(transactions);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.transactionHistory = new transactionHistory_service_1.TransactionHistoryService();
    }
}
exports.TransactionHistoryController = TransactionHistoryController;
