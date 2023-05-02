"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const address_service_1 = require("../../address/services/address.service");
const transactionHistory_service_1 = require("../../transactionHistory/services/transactionHistory.service");
const blockchain_1 = require("../../../blockchain");
const frequent_service_1 = require("../../frequent/services/frequent.service");
class TransferService extends transactionHistory_service_1.TransactionHistoryService {
    constructor() {
        super();
        this.getFeeTransfer = async (coin, blockchain, amount, address) => {
            try {
                if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                    throw new Error(`Invalid blockchain.`);
                }
                const feeTransfer = await blockchain_1.blockchainService[blockchain.toLowerCase()].getFeeTransaction(coin, blockchain, "TRANSFER", amount, address);
                if (!feeTransfer) {
                    throw new Error(`Internal error fee preview.`);
                }
                return feeTransfer;
            }
            catch (err) {
                throw new Error(`Failed to get fee transfer, ${err}`);
            }
        };
        this.sendTransfer = async (fromDefix, privateKey, toDefix, coin, amount, blockchain) => {
            var _a, _b;
            try {
                let transactionHash, fromAddress, toAddress, tipoEnvio;
                if (fromDefix.includes(".defix3")) {
                    fromAddress = (_a = (await this.addressService.getAddressByDefixId(fromDefix, blockchain))) === null || _a === void 0 ? void 0 : _a.address;
                }
                else {
                    fromAddress = fromDefix;
                }
                if (toDefix.includes(".defix3")) {
                    toAddress = (_b = (await this.addressService.getAddressByDefixId(toDefix, blockchain))) === null || _b === void 0 ? void 0 : _b.address;
                    tipoEnvio = "user";
                }
                else {
                    toAddress = toDefix;
                    tipoEnvio = "wallet";
                }
                if (!fromAddress || !toAddress)
                    throw new Error(`Invalid data.`);
                if (Object.keys(blockchain_1.blockchainService).includes(coin.toLowerCase())) {
                    transactionHash = await blockchain_1.blockchainService[coin.toLowerCase()].sendTransfer(fromAddress, privateKey, toAddress, amount, coin);
                }
                else {
                    if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                        throw new Error(`Invalid data.`);
                    }
                    const srcContract = await utils_shared_1.UtilsShared.getTokenContract(coin, blockchain);
                    if (!srcContract)
                        throw new Error(`Failed to get token contract.`);
                    transactionHash = await blockchain_1.blockchainService[blockchain.toLowerCase()].sendTransferToken(fromAddress, privateKey, toAddress, amount, srcContract);
                }
                if (!transactionHash)
                    throw new Error(`Transaction hash.`);
                const transaction = await this.createTransactionHistory({
                    fromDefix,
                    toDefix,
                    fromAddress,
                    toAddress,
                    blockchain,
                    coin,
                    amount,
                    hash: transactionHash,
                    typeTxn: "TRANSFER",
                });
                await this.frequentService.createFrequent(fromDefix, toDefix, "TRANSFER");
                return transaction;
                // const resSend = await getEmailFlagFN(fromDefix, "SEND");
                // const resReceive = await getEmailFlagFN(toDefix, "RECEIVE");
                // const item = {
                //   monto: amount,
                //   moneda: coin,
                //   receptor: toDefix,
                //   emisor: fromDefix,
                //   tipoEnvio: tipoEnvio,
                // };
                // EnvioCorreo(resSend, resReceive, "envio", item);
            }
            catch (err) {
                throw new Error(`Failed to send transfer, ${err}`);
            }
        };
        this.addressService = new address_service_1.AddressService();
        this.frequentService = new frequent_service_1.FrequentService();
    }
}
exports.TransferService = TransferService;
