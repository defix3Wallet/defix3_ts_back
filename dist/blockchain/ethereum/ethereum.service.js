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
exports.EthereumService = void 0;
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN = process.env.ETHERSCAN;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(`https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`));
class EthereumService {
    fromMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
            const credential = {
                name: "ETH",
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
                    name: "ETH",
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
}
exports.EthereumService = EthereumService;
