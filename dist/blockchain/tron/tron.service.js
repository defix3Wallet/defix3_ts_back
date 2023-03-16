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
exports.TronService = void 0;
const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;
const TRON_PRO_API_KEY = process.env.TRON_PRO_API_KEY;
const FULL_NODE = process.env.FULL_NODE;
const SOLIDITY_NODE = process.env.SOLIDITY_NODE;
const EVENT_SERVER = process.env.EVENT_SERVER;
const fullNode = new HttpProvider(FULL_NODE);
const solidityNode = new HttpProvider(SOLIDITY_NODE);
const eventServer = new HttpProvider(EVENT_SERVER);
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
tronWeb.setHeader({ "TRON-PRO-API-KEY": TRON_PRO_API_KEY });
class TronService {
    fromMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield tronWeb.fromMnemonic(mnemonic);
            let privateKey;
            if (account.privateKey.indexOf("0x") === 0) {
                privateKey = account.privateKey.slice(2);
            }
            else {
                privateKey = account.privateKey;
            }
            const credential = {
                name: "TRX",
                address: account.address,
                privateKey: privateKey,
            };
            return credential;
        });
    }
    fromPrivateKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = tronWeb.address.fromPrivateKey(privateKey);
                if (!address)
                    return null;
                const credential = {
                    name: "TRX",
                    address: address,
                    privateKey: privateKey,
                };
                return credential;
            }
            catch (error) {
                return null;
            }
        });
    }
    isAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tronWeb.isAddress(address);
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let balanceTotal = 0;
                const balance = yield tronWeb.trx.getBalance(address);
                if (balance) {
                    let value = Math.pow(10, 6);
                    balanceTotal = balance / value;
                    if (!balanceTotal) {
                        balanceTotal = 0;
                    }
                    return balanceTotal;
                }
                else {
                    return balanceTotal;
                }
            }
            catch (error) {
                return 0;
            }
        });
    }
    getBalanceToken(address, srcContract, decimals) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                tronWeb.setAddress(srcContract);
                const contract = yield tronWeb.contract().at(srcContract);
                const balance = yield contract.balanceOf(address).call();
                let balanceTotal = 0;
                if (balance) {
                    let value = Math.pow(10, decimals);
                    balanceTotal = balance / value;
                    if (!balanceTotal) {
                        balanceTotal = 0;
                    }
                    return balanceTotal;
                }
                else {
                    return balanceTotal;
                }
            }
            catch (error) {
                return 0;
            }
        });
    }
    sendTransfer(fromAddress, privateKey, toAddress, amount, coin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.getBalance(fromAddress);
                if (balance < amount) {
                    throw new Error(`Error: You do not have enough funds to make the transfer`);
                }
                tronWeb.setAddress(fromAddress);
                let value = Math.pow(10, 6);
                let srcAmount = parseInt(String(amount * value));
                const tx = yield tronWeb.transactionBuilder
                    .sendTrx(toAddress, srcAmount)
                    .then(function (response) {
                    return response;
                })
                    .catch(function (error) {
                    return false;
                });
                if (!tx)
                    throw new Error(`Error to do build transaction`);
                const signedTxn = yield tronWeb.trx
                    .sign(tx, privateKey)
                    .then(function (response) {
                    return response;
                })
                    .catch(function (error) {
                    return false;
                });
                if (!signedTxn.signature) {
                    throw new Error(`Error to sign transaction`);
                }
                const result = yield tronWeb.trx.sendRawTransaction(signedTxn);
                if (!result.txid)
                    throw new Error(`Failed to send raw tx.`);
                return result.txid;
            }
            catch (err) {
                throw new Error(`Failed to send transfer, ${err.message}`);
            }
        });
    }
    sendTransferToken(fromAddress, privateKey, toAddress, amount, srcToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.getBalanceToken(fromAddress, srcToken.contract, srcToken.decimals);
                if (balance < amount) {
                    throw new Error(`Error: You do not have enough funds to make the transfer`);
                }
                tronWeb.setAddress(fromAddress);
                let value = Math.pow(10, srcToken.decimals);
                let srcAmount = parseInt(String(amount * value));
                const contract = yield tronWeb.contract().at(srcToken.contract);
                const transaction = yield contract.transfer(toAddress, srcAmount).send({
                    callValue: 0,
                    shouldPollResponse: true,
                    privateKey: privateKey,
                });
                console.log("TRANSACTION: ", transaction);
                return transaction;
            }
            catch (err) {
                throw new Error(`Failed to send transfer, ${err.message}`);
            }
        });
    }
    previewSwap(fromCoin, toCoin, amount, blockchain, address) {
        throw new Error("Method not implemented.");
    }
}
exports.TronService = TronService;
