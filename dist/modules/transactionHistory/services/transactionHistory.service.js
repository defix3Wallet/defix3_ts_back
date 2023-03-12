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
exports.TransactionHistoryService = void 0;
const transactionHistory_entity_1 = require("../entities/transactionHistory.entity");
class TransactionHistoryService {
    constructor() {
        this.createTransactionHistory = ({ fromDefix, toDefix, fromAddress, toAddress, blockchain, coin, amount, hash, typeTxn, }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionHistory = new transactionHistory_entity_1.TransactionHistoryEntity();
                transactionHistory.fromDefix = fromDefix;
                transactionHistory.toDefix = toDefix;
                transactionHistory.fromAddress = fromAddress;
                transactionHistory.toAddress = toAddress;
                transactionHistory.blockchain = blockchain;
                transactionHistory.coin = coin;
                transactionHistory.amount = amount;
                transactionHistory.hash = hash;
                transactionHistory.typeTxn = typeTxn;
                return yield transactionHistory.save();
            }
            catch (err) {
                throw new Error(`Failed to create address: ${err}`);
            }
        });
        this.getTransactionHistory = (defixId, coin = null, blockchain = null, hash = null, typeTxn = null, year = null) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield transactionHistory_entity_1.TransactionHistoryEntity.createQueryBuilder("transaction")
                    .where("(transaction.fromDefix = :defixId OR transaction.toDefix = :defixId) \
          AND (transaction.coin = :coin IS NULL OR transaction.coin = :coin) \
          AND (transaction.blockchain = :blockchain IS NULL OR transaction.blockchain = :blockchain) \
          AND (transaction.hash = :hash IS NULL OR transaction.hash = :hash) \
          AND (transaction.typeTxn = :typeTxn IS NULL OR transaction.typeTxn = :typeTxn)", {
                    defixId,
                    coin,
                    blockchain,
                    hash,
                    typeTxn,
                })
                    .getMany();
                return transactions;
            }
            catch (err) {
                console.log(err);
                throw new Error(`Failed to get address: ${err}`);
            }
        });
    }
}
exports.TransactionHistoryService = TransactionHistoryService;
