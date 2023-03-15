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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceService = void 0;
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const abi_json_1 = __importDefault(require("../abi.json"));
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN = process.env.ETHERSCAN;
const WEB_BSC = process.env.WEB_BSC;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(WEB_BSC || ""));
class BinanceService {
    fromMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
            const credential = {
                name: "BNB",
                address: wallet.address,
                privateKey: wallet.privateKey,
            };
            return credential;
        });
    }
    fromPrivateKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
                const credential = {
                    name: "BNB",
                    address: wallet.address,
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
            return yield web3.utils.isAddress(address);
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let balance = yield web3.eth.getBalance(address);
                let balanceTotal = 0;
                if (balance) {
                    let value = Math.pow(10, 18);
                    balanceTotal = Number(balance) / value;
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
                let contract = new web3.eth.Contract(abi_json_1.default, srcContract);
                const balance = yield contract.methods.balanceOf(address).call();
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
                const gasPrice = yield web3.eth.getGasPrice();
                const gasLimit = 21000;
                const nonce = yield web3.eth.getTransactionCount(fromAddress);
                const rawTransaction = {
                    from: fromAddress,
                    to: toAddress,
                    value: web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether")),
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(gasLimit),
                    nonce: nonce,
                };
                const signedTransaction = yield web3.eth.accounts.signTransaction(rawTransaction, privateKey);
                if (!signedTransaction.rawTransaction)
                    throw new Error(`Error: Failed to sign transaction`);
                const transactionHash = yield web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
                if (!transactionHash.transactionHash)
                    throw new Error(`Error: Failed to send transaction`);
                return transactionHash.transactionHash;
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
                const provider = new ethers_1.ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_PROJECT_ID);
                const minABI = abi_json_1.default;
                const wallet = new ethers_1.ethers.Wallet(privateKey);
                const signer = wallet.connect(provider);
                const contract = new ethers_1.ethers.Contract(srcToken.contract, minABI, signer);
                let value = Math.pow(10, srcToken.decimals);
                let srcAmount = amount * value;
                const tx = yield contract.transfer(toAddress, String(srcAmount));
                if (!tx.hash)
                    throw new Error(`Error tx hash.`);
                return tx.hash;
            }
            catch (err) {
                throw new Error(`Failed to send transfer, ${err.message}`);
            }
        });
    }
}
exports.BinanceService = BinanceService;
