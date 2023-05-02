"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHistoryService = void 0;
const transactionHistory_entity_1 = require("../entities/transactionHistory.entity");
class TransactionHistoryService {
    constructor() {
        this.createTransactionHistory = async ({ fromDefix, toDefix, fromAddress, toAddress, blockchain, coin, amount, hash, typeTxn }) => {
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
                return await transactionHistory.save();
            }
            catch (err) {
                throw new Error(`Failed to create address: ${err}`);
            }
        };
        this.getTransactionHistory = async (defixId, coin = null, blockchain = null, hash = null, typeTxn = null, year = null) => {
            try {
                const transactions = await transactionHistory_entity_1.TransactionHistoryEntity.createQueryBuilder("transaction")
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
        };
    }
}
exports.TransactionHistoryService = TransactionHistoryService;
