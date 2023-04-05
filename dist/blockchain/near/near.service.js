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
exports.NearService = void 0;
const near_api_js_1 = require("near-api-js");
const nearSEED = require("near-seed-phrase");
const bn_js_1 = __importDefault(require("bn.js"));
const ref_sdk_1 = require("@ref-finance/ref-sdk");
const transaction_1 = require("near-api-js/lib/transaction");
const near_utils_1 = require("./near.utils");
const utils_shared_1 = require("../../shared/utils/utils.shared");
const NETWORK = process.env.NETWORK || "testnet";
const ETHERSCAN = process.env.ETHERSCAN;
let NEAR;
if (process.env.NEAR_ENV === "testnet") {
    NEAR = "testnet";
}
else {
    NEAR = "near";
}
const dataToken = {
    decimals: 24,
    contract: "wrap.testnet",
};
class NearService {
    fromMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletSeed = yield nearSEED.parseSeedPhrase(mnemonic);
            const keyPair = near_api_js_1.KeyPair.fromString(walletSeed.secretKey);
            const implicitAccountId = Buffer.from(keyPair.getPublicKey().data).toString("hex");
            const credential = {
                name: "NEAR",
                address: implicitAccountId,
                privateKey: walletSeed.secretKey,
            };
            return credential;
        });
    }
    fromPrivateKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!privateKey.includes("ed25519:"))
                    return null;
                const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
                const implicitAccountId = Buffer.from(keyPair.getPublicKey().data).toString("hex");
                const credential = {
                    name: "NEAR",
                    address: implicitAccountId,
                    privateKey: privateKey,
                };
                return credential;
            }
            catch (error) {
                return null;
            }
        });
    }
    importWallet(nearId, mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletSeed = yield nearSEED.parseSeedPhrase(mnemonic);
            const credential = {
                name: "NEAR",
                address: nearId,
                privateKey: walletSeed.secretKey,
            };
            return credential;
        });
    }
    isAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
            const near = new near_api_js_1.Near(near_utils_1.NearUtils.ConfigNEAR(keyStore));
            const account = new near_utils_1.AccountService(near.connection, address);
            const is_address = yield account
                .state()
                .then((response) => {
                return true;
            })
                .catch((error) => {
                return false;
            });
            return is_address;
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let balanceTotal = 0;
                const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
                const near = new near_api_js_1.Near(near_utils_1.NearUtils.ConfigNEAR(keyStore));
                const account = new near_utils_1.AccountService(near.connection, address);
                const balanceAccount = yield account.state();
                const valueStorage = Math.pow(10, 19);
                const valueYocto = Math.pow(10, 24);
                const storage = (balanceAccount.storage_usage * valueStorage) / valueYocto;
                balanceTotal = Number(balanceAccount.amount) / valueYocto - storage - 0.05;
                if (balanceTotal === null || balanceTotal < 0) {
                    balanceTotal = 0;
                }
                return balanceTotal;
            }
            catch (error) {
                return 0;
            }
        });
    }
    getBalanceToken(address, srcContract, decimals) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
                const near = new near_api_js_1.Near(near_utils_1.NearUtils.ConfigNEAR(keyStore));
                const account = new near_utils_1.AccountService(near.connection, address);
                const balance = yield account.viewFunction({
                    contractId: srcContract,
                    methodName: "ft_balance_of",
                    args: { account_id: address },
                });
                if (!balance)
                    return 0;
                return balance / Math.pow(10, decimals);
            }
            catch (error) {
                return 0;
            }
        });
    }
    getFeeTransaction(coin, blockchain, typeTxn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                if (!comision) {
                    feeMain.fee = "0";
                }
                else {
                    feeMain.fee = "0";
                }
                return feeMain;
            }
            catch (err) {
                throw new Error(`Failed to get fee transfer, ${err.message}`);
            }
        });
    }
    sendTransfer(fromAddress, privateKey, toAddress, amount, coin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.getBalance(fromAddress);
                if (balance < amount)
                    throw new Error(`Error: You do not have enough funds to make the transfer`);
                const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
                const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
                keyStore.setKey(NETWORK, fromAddress, keyPair);
                const near = new near_api_js_1.Near(near_utils_1.NearUtils.ConfigNEAR(keyStore));
                const account = new near_utils_1.AccountService(near.connection, fromAddress);
                const amountInYocto = near_api_js_1.utils.format.parseNearAmount(String(amount));
                if (!amountInYocto)
                    throw new Error(`Failed to send transfer.`);
                const response = yield account.sendMoney(toAddress, new bn_js_1.default(amountInYocto));
                if (!response.transaction.hash)
                    throw new Error(`Failed to send transfer.`);
                return response.transaction.hash;
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fromToken = yield utils_shared_1.UtilsShared.getTokenContract(fromCoin, blockchain);
                let toToken = yield utils_shared_1.UtilsShared.getTokenContract(toCoin, blockchain);
                if (!fromToken) {
                    fromToken = dataToken;
                }
                if (!toToken) {
                    toToken = dataToken;
                }
                const tokenIn = fromToken.contract;
                const tokenOut = toToken.contract;
                const tokensMetadata = yield (0, ref_sdk_1.ftGetTokensMetadata)([tokenIn, tokenOut]);
                const transactionsRef = yield near_utils_1.NearUtils.getTxSwapRef(tokensMetadata[tokenIn], tokensMetadata[tokenOut], amount, address);
                const transactionsDcl = yield near_utils_1.NearUtils.getTxSwapDCL(tokensMetadata[tokenIn], tokensMetadata[tokenOut], amount);
                const minAmountRef = yield near_utils_1.NearUtils.getMinAmountOut(transactionsRef);
                const minAmountDcl = yield near_utils_1.NearUtils.getMinAmountOut(transactionsDcl);
                let txMain;
                let minAmountOut = 0;
                if (minAmountRef && !minAmountDcl) {
                    console.log("REF");
                    txMain = transactionsRef;
                    minAmountOut = minAmountRef;
                }
                else if (!minAmountRef && minAmountDcl) {
                    console.log("DCL");
                    txMain = transactionsDcl;
                    minAmountOut = minAmountDcl;
                }
                else if (minAmountRef && minAmountDcl) {
                    if (minAmountRef > minAmountDcl) {
                        console.log("REF");
                        txMain = transactionsRef;
                        minAmountOut = minAmountRef;
                    }
                    else {
                        console.log("DCL");
                        txMain = transactionsDcl;
                        minAmountOut = minAmountDcl;
                    }
                }
                if (!txMain || !minAmountOut)
                    return;
                const transaction = txMain.find((element) => element.functionCalls[0].methodName === "ft_transfer_call");
                if (!transaction)
                    return false;
                const transfer = transaction.functionCalls[0].args;
                const amountIn = transfer.amount;
                const comision = yield utils_shared_1.UtilsShared.getComision(blockchain);
                let feeTransfer = "0";
                let porcentFee = 0;
                if (comision.swap) {
                    porcentFee = comision.swap / 100;
                }
                let feeDefix = String(Number(amount) * porcentFee);
                const firstNum = Number(amountIn) / Math.pow(10, Number(tokensMetadata[tokenIn].decimals));
                const secondNum = minAmountOut / Math.pow(10, Number(tokensMetadata[tokenOut].decimals));
                const swapRate = String(secondNum / firstNum);
                const dataSwap = {
                    exchange: "Ref Finance",
                    fromAmount: amountIn,
                    fromDecimals: tokensMetadata[tokenIn].decimals,
                    toAmount: minAmountOut,
                    toDecimals: tokensMetadata[tokenOut].decimals,
                    block: null,
                    swapRate,
                    contract: tokenIn,
                    fee: String(porcentFee),
                    feeDefix: feeDefix,
                    feeTotal: String(Number(feeDefix)),
                };
                return { dataSwap, priceRoute: { tokenIn, tokenOut, amountIn, minAmountOut, txMain } };
            }
            catch (error) {
                throw new Error(`Feiled to get preview swap., ${error.message}`);
            }
        });
    }
    sendSwap(priceRoute, privateKey, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = priceRoute.txMain.find((element) => element.functionCalls[0].methodName === "ft_transfer_call");
                if (!transaction)
                    throw new Error(`Failed to create tx.`);
                const tokensMetadata = yield (0, ref_sdk_1.ftGetTokensMetadata)([priceRoute.tokenIn, priceRoute.tokenOut]);
                const tokenIn = tokensMetadata[priceRoute.tokenIn];
                const tokenOut = tokensMetadata[priceRoute.tokenOut];
                const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
                const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
                keyStore.setKey(process.env.NEAR_ENV, address, keyPair);
                const near = new near_api_js_1.Near(near_utils_1.NearUtils.ConfigNEAR(keyStore));
                const account = new near_utils_1.AccountService(near.connection, address);
                let nearTransactions = [];
                if (priceRoute.tokenIn.includes("wrap.")) {
                    const trx = yield near_utils_1.NearUtils.createTransaction(priceRoute.tokenIn, [yield (0, transaction_1.functionCall)("near_deposit", {}, new bn_js_1.default("300000000000000"), new bn_js_1.default(priceRoute.amountIn))], address, near);
                    nearTransactions.push(trx);
                }
                const trxs = yield Promise.all(priceRoute.txMain.map((tx) => __awaiter(this, void 0, void 0, function* () {
                    return yield near_utils_1.NearUtils.createTransaction(tx.receiverId, tx.functionCalls.map((fc) => {
                        return (0, transaction_1.functionCall)(fc.methodName, fc.args, fc.gas, new bn_js_1.default(String(near_api_js_1.utils.format.parseNearAmount(fc.amount))));
                    }), address, near);
                })));
                nearTransactions = nearTransactions.concat(trxs);
                if (priceRoute.tokenOut.includes("wrap.")) {
                    const trx = yield near_utils_1.NearUtils.createTransaction(priceRoute.minAmountOut, [yield (0, transaction_1.functionCall)("near_withdraw", { amount: priceRoute.minAmountOut }, new bn_js_1.default("300000000000000"), new bn_js_1.default("1"))], address, near);
                    nearTransactions.push(trx);
                }
                let resultSwap;
                for (let trx of nearTransactions) {
                    const result = yield account.signAndSendTrx(trx);
                    if (trx.actions[0].functionCall.methodName === "ft_transfer_call") {
                        resultSwap = result;
                    }
                }
                if (!resultSwap.transaction.hash)
                    return false;
                const transactionHash = resultSwap.transaction.hash;
                const block = resultSwap.transaction_outcome.block_hash;
                if (!transactionHash)
                    return false;
                const srcAmount = String(Number(priceRoute.amountIn) / Math.pow(10, tokenIn.decimals));
                const destAmount = String(Number(priceRoute.minAmountOut) / Math.pow(10, tokenOut.decimals));
                return {
                    transactionHash,
                    srcAmount,
                    destAmount,
                    block,
                };
            }
            catch (err) {
                throw new Error(`Failed to send swap, ${err.message}`);
            }
        });
    }
}
exports.NearService = NearService;
