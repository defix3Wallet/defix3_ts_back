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
        this.createTransactionHistory = ({ fromDefix, toDefix, fromAddress, toAddress, blockchain, coin, amount, hash, type, }) => __awaiter(this, void 0, void 0, function* () {
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
                transactionHistory.type = type;
                return yield transactionHistory.save();
            }
            catch (err) {
                throw new Error(`Failed to create address: ${err}`);
            }
        });
        this.getTransactionHistory = (defixId, blockchain, coin, hash, type, year) => __awaiter(this, void 0, void 0, function* () {
            try {
                coin = "NEAR";
                const transactions = yield transactionHistory_entity_1.TransactionHistoryEntity.createQueryBuilder("transaction")
                    .where("transaction.coin = :coin", { coin })
                    .getMany();
                // const transactions = await (
                //   await Transaction.find({
                //     where: {
                //       coin: coin ? coin : undefined,
                //       blockchain: blockchain ? blockchain : undefined,
                //       date_year: date_year ? date_year : undefined,
                //       date_month: date_month ? date_month : undefined,
                //       tipo: tipo ? tipo : undefined,
                //     },
                //   })
                // ).filter(function (element) {
                //   return element.from_defix === defixId || element.to_defix === defixId;
                // });
                return transactions;
            }
            catch (err) {
                throw new Error(`Failed to get address: ${err}`);
            }
        });
    }
}
exports.TransactionHistoryService = TransactionHistoryService;
