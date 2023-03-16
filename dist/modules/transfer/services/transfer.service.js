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
exports.TransferService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const address_service_1 = require("../../address/services/address.service");
const transactionHistory_service_1 = require("../../transactionHistory/services/transactionHistory.service");
const blockchain_1 = require("../../../blockchain");
const frequent_service_1 = require("../../frequent/services/frequent.service");
class TransferService extends transactionHistory_service_1.TransactionHistoryService {
    constructor() {
        super();
        this.sendTransfer = (fromDefix, privateKey, toDefix, coin, amount, blockchain) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let transactionHash, fromAddress, toAddress, tipoEnvio;
                if (fromDefix.includes(".defix3")) {
                    fromAddress = (_a = (yield this.addressService.getAddressByDefixId(fromDefix, blockchain))) === null || _a === void 0 ? void 0 : _a.address;
                }
                else {
                    fromAddress = fromDefix;
                }
                if (toDefix.includes(".defix3")) {
                    toAddress = (_b = (yield this.addressService.getAddressByDefixId(toDefix, blockchain))) === null || _b === void 0 ? void 0 : _b.address;
                    tipoEnvio = "user";
                }
                else {
                    toAddress = toDefix;
                    tipoEnvio = "wallet";
                }
                if (!fromAddress || !toAddress)
                    throw new Error(`Invalid data.`);
                if (Object.keys(blockchain_1.blockchainService).includes(coin.toLowerCase())) {
                    transactionHash = yield blockchain_1.blockchainService[coin.toLowerCase()].sendTransfer(fromAddress, privateKey, toAddress, amount, coin);
                }
                else {
                    if (!Object.keys(blockchain_1.blockchainService).includes(blockchain.toLowerCase())) {
                        throw new Error(`Invalid data.`);
                    }
                    const srcContract = yield utils_shared_1.UtilsShared.getTokenContract(coin, blockchain);
                    if (!srcContract)
                        throw new Error(`Failed to get token contract.`);
                    transactionHash = yield blockchain_1.blockchainService[blockchain.toLowerCase()].sendTransferToken(fromAddress, privateKey, toAddress, amount, srcContract);
                }
                if (!transactionHash)
                    throw new Error(`Transaction hash.`);
                const transaction = yield this.createTransactionHistory({
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
                yield this.frequentService.createFrequent(fromDefix, toDefix);
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
        });
        this.addressService = new address_service_1.AddressService();
        this.frequentService = new frequent_service_1.FrequentService();
    }
}
exports.TransferService = TransferService;
