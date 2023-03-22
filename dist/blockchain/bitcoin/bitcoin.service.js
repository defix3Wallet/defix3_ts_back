"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BitcoinService = void 0;
const ecpair_1 = require("ecpair");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bip39_1 = require("bip39");
const WAValidator = require("wallet-address-validator");
const axios_1 = __importDefault(require("axios"));
const bip32_1 = __importDefault(require("bip32"));
const ecc = __importStar(require("tiny-secp256k1"));
const bip32 = (0, bip32_1.default)(ecc);
const utils_shared_1 = require("../../shared/utils/utils.shared");
const bitcoin_utils_1 = require("./bitcoin.utils");
const tinysecp = require("tiny-secp256k1");
const ECPair = (0, ecpair_1.ECPairFactory)(tinysecp);
const NETWORK = process.env.NETWORK;
class BitcoinService {
    constructor() {
        this.getBalanceBTC_Cypher = (address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const method = "get";
                const url = "https://api.blockcypher.com/v1/btc/" +
                    process.env.BLOCKCYPHER +
                    "/addrs/" +
                    address +
                    "/balance?token=" +
                    "efe763283ba84fef88d23412be0c5970";
                const balance = yield axios_1.default[method](url, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                    if (response.data) {
                        const satoshi = response.data.balance;
                        const value_satoshi = 100000000;
                        return satoshi / value_satoshi || 0;
                    }
                    return 0;
                })
                    .catch((error) => {
                    return 0;
                });
                return balance;
            }
            catch (error) {
                console.log(error);
                return 0;
            }
        });
    }
    fromMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            let network;
            let path;
            if (NETWORK === "mainnet") {
                network = bitcoinjs_lib_1.networks.bitcoin; //use networks.testnet networks.bitcoin for testnet
                path = `m/49'/0'/0'/0`; // Use m/49'/1'/0'/0 for testnet mainnet `m/49'/0'/0'/0
            }
            else {
                network = bitcoinjs_lib_1.networks.testnet;
                path = `m/49'/1/0'/0`;
            }
            const seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic);
            const root = bip32.fromSeed(seed, network);
            const account = root.derivePath(path);
            const node = account.derive(0).derive(0);
            const btcAddress = bitcoinjs_lib_1.payments.p2pkh({
                pubkey: node.publicKey,
                network: network,
            }).address;
            const credential = {
                name: "BTC",
                address: btcAddress || "",
                privateKey: node.toWIF(),
            };
            return credential;
        });
    }
    fromPrivateKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let network;
                let path;
                if (NETWORK === "mainnet") {
                    network = bitcoinjs_lib_1.networks.bitcoin; //use networks.testnet networks.bitcoin for testnet
                    path = `m/49'/0'/0'/0`; // Use m/49'/1'/0'/0 for testnet mainnet `m/49'/0'/0'/0
                }
                else {
                    network = bitcoinjs_lib_1.networks.testnet; //use networks.testnet networks.bitcoin for testnet;
                    path = `m/49'/1/0'/0`;
                }
                const keyPair = ECPair.fromWIF(privateKey, network);
                if (!keyPair.privateKey)
                    return null;
                const chainCode = Buffer.alloc(32);
                const root = bip32.fromPrivateKey(keyPair.privateKey, chainCode);
                const { address } = bitcoinjs_lib_1.payments.p2pkh({
                    pubkey: root.publicKey,
                    network: network,
                });
                if (!address)
                    return null;
                const credential = {
                    name: "BTC",
                    address: address,
                    privateKey: keyPair.toWIF(),
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
            return yield WAValidator.validate(address, "BTC");
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const method = "get";
                const url = "https://blockchain.info/q/addressbalance/" + address;
                const balance = yield axios_1.default[method](url, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.data || response.data === 0) {
                        const satoshi = response.data;
                        const value_satoshi = 100000000;
                        const balance = satoshi / value_satoshi || 0;
                        return balance;
                    }
                    const item = yield this.getBalanceBTC_Cypher(address);
                    return item;
                }))
                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                    const item = yield this.getBalanceBTC_Cypher(address);
                    return item;
                }));
                return balance;
            }
            catch (error) {
                console.error(error);
                const item = yield this.getBalanceBTC_Cypher(address);
                return item;
            }
        });
    }
    getBalanceToken(address, contract, decimals) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    getFeeTransaction(coin, blockchain, typeTxn, amount, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!amount || !address)
                    throw new Error(`Failed to amount tx btc`);
                let comisionAdmin = yield utils_shared_1.UtilsShared.getComision(coin);
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
                feeMain.fee = String(yield bitcoin_utils_1.BitcoinUtils.newTxFee(comision, amount, address));
                return feeMain;
            }
            catch (err) {
                throw new Error(`Failed to get fee transaction, ${err.message}`);
            }
        });
    }
    sendTransfer(fromAddress, privateKey, toAddress, amount, coin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let network;
                if (NETWORK === "mainnet") {
                    network = bitcoinjs_lib_1.networks.bitcoin; //use networks.testnet networks.bitcoin for testnet
                }
                else {
                    network = bitcoinjs_lib_1.networks.testnet; //use networks.testnet networks.bitcoin for testnet
                }
                const keys = ECPair.fromWIF(privateKey, network);
                const value_satoshi = 100000000;
                const amountSatoshi = amount * value_satoshi;
                const vaultSatoshi = 0; // parseInt(String(for_vault * value_satoshi));
                const data = {
                    inputs: [
                        {
                            addresses: [fromAddress],
                        },
                    ],
                    outputs: [
                        {
                            addresses: [toAddress],
                            value: parseInt(String(amountSatoshi)),
                        },
                    ],
                };
                if (vaultSatoshi !== 0) {
                    data.outputs.push({
                        addresses: [fromAddress],
                        value: parseInt(String(vaultSatoshi)),
                    });
                }
                const config = {
                    method: "post",
                    url: "https://api.blockcypher.com/v1/btc/" +
                        process.env.BLOCKCYPHER +
                        "/txs/new",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: data,
                };
                let txHash = null;
                yield (0, axios_1.default)(config)
                    .then(function (tmptx) {
                    return __awaiter(this, void 0, void 0, function* () {
                        tmptx.data.pubkeys = [];
                        tmptx.data.signatures = tmptx.data.tosign.map(function (tosign, n) {
                            tmptx.data.pubkeys.push(keys.publicKey.toString("hex"));
                            return bitcoinjs_lib_1.script.signature
                                .encode(keys.sign(Buffer.from(tosign, "hex")), 0x01)
                                .toString("hex")
                                .slice(0, -2);
                        });
                        const result = axios_1.default
                            .post("https://api.blockcypher.com/v1/btc/" +
                            process.env.BLOCKCYPHER +
                            "/txs/send", tmptx.data)
                            .then(function (finaltx) {
                            txHash = finaltx.data.tx.hash;
                            console.log("hash", finaltx.data.tx.hash);
                            return true;
                        })
                            .catch(function (err) {
                            throw new Error(`Failed to axios, ${err.message}`);
                        });
                        return result;
                    });
                })
                    .catch(function (err) {
                    throw new Error(`Failed to axios, ${err.message}`);
                });
                if (!txHash)
                    throw new Error(`Failed to send btc, hash.`);
                return txHash;
            }
            catch (err) {
                throw new Error(`Failed to send transfer, ${err.message}`);
            }
        });
    }
    sendTransferToken(fromAddress, privateKey, toAddress, amount, srcToken) {
        throw new Error("Method not implemented.");
    }
    previewSwap(fromCoin, toCoin, amount, blockchain, address) {
        throw new Error("Method not implemented.");
    }
    sendSwap(priceRoute, privateKey, address) {
        throw new Error("Method not implemented.");
    }
}
exports.BitcoinService = BitcoinService;
