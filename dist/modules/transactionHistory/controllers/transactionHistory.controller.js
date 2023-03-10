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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHistoryController = void 0;
const transactionHistory_service_1 = require("../services/transactionHistory.service");
class TransactionHistoryController {
    constructor() {
        this.getTransactionHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, blockchain, coin, hash, type, year } = req.body;
                const transactions = yield this.transactionHistory.getTransactionHistory(defixId, blockchain, coin, hash, type, year);
                res.send(transactions);
            }
            catch (error) {
                return res.status(500).send({ message: error });
            }
        });
        this.transactionHistory = new transactionHistory_service_1.TransactionHistoryService();
    }
}
exports.TransactionHistoryController = TransactionHistoryController;
