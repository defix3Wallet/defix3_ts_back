"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TronService = void 0;
const utils_shared_1 = require("../../shared/utils/utils.shared");
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
    sendLimitOrder(fromCoin, toCoin, srcAmount, destAmount, blockchain, address, privateKey) {
        throw new Error("Method not implemented.");
    }
    async fromMnemonic(mnemonic) {
        const account = await tronWeb.fromMnemonic(mnemonic);
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
    }
    async fromPrivateKey(privateKey) {
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
    }
    async isAddress(address) {
        return await tronWeb.isAddress(address);
    }
    async getBalance(address) {
        try {
            let balanceTotal = 0;
            const balance = await tronWeb.trx.getBalance(address);
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
    }
    async getBalanceToken(address, srcContract, decimals) {
        try {
            tronWeb.setAddress(srcContract);
            const contract = await tronWeb.contract().at(srcContract);
            const balance = await contract.balanceOf(address).call();
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
    }
    async getFeeTransaction(coin, blockchain, typeTxn) {
        try {
            let comisionAdmin = await utils_shared_1.UtilsShared.getComision(coin);
            const feeMain = {
                coin,
                blockchain,
                fee: "",
            };
            let comision;
            if (typeTxn === "TRANSFER") {
                comision = comisionAdmin.transfer;
            }
            else if (typeTxn === "WITHDRAW") {
                comision = comisionAdmin.withdraw;
            }
            if (!comision) {
                feeMain.fee = "0";
            }
            else {
                feeMain.fee = "0";
            }
            return feeMain;
        }
        catch (err) {
            throw new Error(`Failed to get fee transaction, ${err.message}`);
        }
    }
    async sendTransfer(fromAddress, privateKey, toAddress, amount, coin) {
        try {
            const balance = await this.getBalance(fromAddress);
            if (balance < amount) {
                throw new Error(`Error: You do not have enough funds to make the transfer`);
            }
            tronWeb.setAddress(fromAddress);
            let value = Math.pow(10, 6);
            let srcAmount = parseInt(String(amount * value));
            const tx = await tronWeb.transactionBuilder
                .sendTrx(toAddress, srcAmount)
                .then(function (response) {
                return response;
            })
                .catch(function (error) {
                return false;
            });
            if (!tx)
                throw new Error(`Error to do build transaction`);
            const signedTxn = await tronWeb.trx
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
            const result = await tronWeb.trx.sendRawTransaction(signedTxn);
            if (!result.txid)
                throw new Error(`Failed to send raw tx.`);
            return result.txid;
        }
        catch (err) {
            throw new Error(`Failed to send transfer, ${err.message}`);
        }
    }
    async sendTransferToken(fromAddress, privateKey, toAddress, amount, srcToken) {
        try {
            const balance = await this.getBalanceToken(fromAddress, srcToken.contract, srcToken.decimals);
            if (balance < amount) {
                throw new Error(`Error: You do not have enough funds to make the transfer`);
            }
            tronWeb.setAddress(fromAddress);
            let value = Math.pow(10, srcToken.decimals);
            let srcAmount = parseInt(String(amount * value));
            const contract = await tronWeb.contract().at(srcToken.contract);
            const transaction = await contract.transfer(toAddress, srcAmount).send({
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
    }
    previewSwap(fromCoin, toCoin, amount, blockchain, address) {
        throw new Error("Method not implemented.");
    }
    sendSwap(priceRoute, privateKey, address) {
        throw new Error("Method not implemented.");
    }
}
exports.TronService = TronService;
