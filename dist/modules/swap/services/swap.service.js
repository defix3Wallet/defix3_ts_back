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
exports.SwapService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const transactionHistory_service_1 = require("../../transactionHistory/services/transactionHistory.service");
const blockchain_1 = require("../../../blockchain");
class SwapService extends transactionHistory_service_1.TransactionHistoryService {
    constructor() {
        super();
        this.getPreviewSwap = (fromCoin, toCoin, amount, blockchain, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                    throw new Error(`Invalid blockchain.`);
                }
                const swapResult = yield blockchain_1.blockchainService[blockchain.toLowerCase()].previewSwap(fromCoin, toCoin, amount, blockchain, address);
                if (!swapResult) {
                    throw new Error(`Internal error swap preview.`);
                }
                return swapResult;
            }
            catch (err) {
                throw new Error(`Failed to get preview swap, ${err}`);
            }
        });
        this.sendSwap = (defixId, fromCoin, toCoin, priceRoute, privateKey, blockchain, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                    throw new Error(`Invalid blockchain.`);
                }
                const swapResult = yield blockchain_1.blockchainService[blockchain.toLowerCase()].sendSwap(priceRoute, privateKey, address);
                if (!swapResult)
                    throw new Error(`Transaction hash.`);
                const coin = fromCoin + "/" + toCoin;
                const transactionHistory = yield this.createTransactionHistory({
                    fromDefix: defixId,
                    toDefix: defixId,
                    fromAddress: address,
                    toAddress: address,
                    coin,
                    blockchain,
                    amount: swapResult.srcAmount,
                    hash: swapResult.transactionHash,
                    typeTxn: "SWAP",
                });
                transactionHistory.block = swapResult.block;
                transactionHistory.destAmount = swapResult.destAmount;
                transactionHistory.linkTxn = utils_shared_1.UtilsShared.getLinkTransaction(blockchain, swapResult.transactionHash);
                return transactionHistory;
            }
            catch (err) {
                throw new Error(`Failed to send swap, ${err}`);
            }
        });
    }
}
exports.SwapService = SwapService;
