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
exports.NearService = void 0;
const near_api_js_1 = require("near-api-js");
const nearSEED = require("near-seed-phrase");
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
            const near = new near_api_js_1.Near(utils_shared_1.UtilsShared.ConfigNEAR(keyStore));
            const account = new near_api_js_1.Account(near.connection, address);
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
                const near = new near_api_js_1.Near(utils_shared_1.UtilsShared.ConfigNEAR(keyStore));
                const account = new near_api_js_1.Account(near.connection, address);
                const balanceAccount = yield account.state();
                const valueStorage = Math.pow(10, 19);
                const valueYocto = Math.pow(10, 24);
                const storage = (balanceAccount.storage_usage * valueStorage) / valueYocto;
                balanceTotal =
                    Number(balanceAccount.amount) / valueYocto - storage - 0.05;
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
                const near = new near_api_js_1.Near(utils_shared_1.UtilsShared.ConfigNEAR(keyStore));
                const account = new near_api_js_1.Account(near.connection, address);
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
}
exports.NearService = NearService;
