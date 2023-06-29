"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const transactionHistory_service_1 = require("../../transactionHistory/services/transactionHistory.service");
const blockchain_1 = require("../../../blockchain");
class SwapService extends transactionHistory_service_1.TransactionHistoryService {
    constructor() {
        super();
        this.getPreviewSwap = async (fromCoin, toCoin, amount, blockchain, address) => {
            try {
                if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                    throw new Error(`Invalid blockchain.`);
                }
                const swapResult = await blockchain_1.blockchainService[blockchain.toLowerCase()].previewSwap(fromCoin, toCoin, amount, blockchain, address);
                console.log("Brrr");
                console.log(swapResult);
                if (!swapResult) {
                    throw new Error(`Internal error swap preview.`);
                }
                return swapResult;
            }
            catch (err) {
                throw new Error(`Failed to get preview swap, ${err}`);
            }
        };
        this.sendSwap = async (defixId, fromCoin, toCoin, priceRoute, privateKey, blockchain, address) => {
            try {
                if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                    throw new Error(`Invalid blockchain.`);
                }
                const swapResult = await blockchain_1.blockchainService[blockchain.toLowerCase()].sendSwap(priceRoute, privateKey, address);
                if (!swapResult)
                    throw new Error(`Transaction hash.`);
                const coin = fromCoin + "/" + toCoin;
                const transactionHistory = await this.createTransactionHistory({
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
        };
    }
}
exports.SwapService = SwapService;
