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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsShared = void 0;
const axios_1 = __importDefault(require("axios"));
const postgres_1 = __importDefault(require("../../config/postgres"));
const address_entity_1 = require("../../modules/address/entities/address.entity");
const nearSEED = require("near-seed-phrase");
const NETWORK = process.env.NETWORK || "testnet";
class UtilsShared {
}
exports.UtilsShared = UtilsShared;
_a = UtilsShared;
UtilsShared.getTokenContract = (token, blockchain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conexion = yield (0, postgres_1.default)();
        const response = yield conexion.query("SELECT *\
        FROM backend_token a\
        inner join backend_cryptocurrency b on b.id = a.cryptocurrency_id\
        where a.coin = $1 and b.coin = $2", [token, blockchain]);
        if (response.rows.length === 0)
            return false;
        return response.rows[0];
    }
    catch (error) {
        throw new Error(`Failed to get token contract.`);
    }
});
UtilsShared.getComision = (coin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = process.env.URL_DJANGO + "api/v1/get-comision/" + coin;
        const result = axios_1.default
            .get(url)
            .then(function (response) {
            return response.data;
        })
            .catch(function (err) {
            throw new Error(`Failed to get comision api. ${err.message}}`);
        });
        return result;
    }
    catch (error) {
        throw new Error(`Failed to get comision fn. ${error.message}`);
    }
});
UtilsShared.getAddressUser = (defixId, blockchain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield address_entity_1.AddressEntity.findOneBy({
            user: { defixId: defixId },
            blockchain: blockchain,
        });
        if (!address)
            return false;
        return address.address;
    }
    catch (error) {
        return false;
    }
});
UtilsShared.getCryptos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conexion = yield (0, postgres_1.default)();
        const cryptocurrencys = yield conexion.query("select * from backend_cryptocurrency");
        const cryptos = [];
        for (let cryptocurrency of cryptocurrencys.rows) {
            const tokens = yield conexion.query("select * from backend_token where cryptocurrency_id = $1", [cryptocurrency.id]);
            cryptocurrency.tokens = tokens.rows;
            cryptos.push(cryptocurrency);
        }
        return cryptos;
    }
    catch (error) {
        console.log(error);
        return [];
    }
});
UtilsShared.validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
};
UtilsShared.getIdNear = (mnemonic) => __awaiter(void 0, void 0, void 0, function* () {
    const walletSeed = yield nearSEED.parseSeedPhrase(mnemonic);
    const split = String(walletSeed.publicKey).split(":");
    const id = String(split[1]);
    return id;
});
UtilsShared.getAddressVault = (coin) => {
    switch (coin) {
        case "BTC":
            return process.env.VAULT_BTC;
        case "NEAR":
            return process.env.VAULT_NEAR;
        case "ETH":
            return process.env.VAULT_ETH;
        case "TRX":
            return process.env.VAULT_TRON;
        case "BNB":
            return process.env.VAULT_BNB;
        default:
            throw new Error(`Unconfigured environment '${coin}'`);
    }
};
UtilsShared.getLinkTransaction = (blockchain, transactionHash) => {
    switch (blockchain) {
        case "BTC":
            if (process.env.NETWORK === "mainnet") {
                return `https://live.blockcypher.com/btc/tx/${transactionHash}`;
            }
            else {
                return `https://live.blockcypher.com/btc-testnet/tx/${transactionHash}`;
            }
        case "NEAR":
            if (process.env.NETWORK === "mainnet") {
                return `https://explorer.near.org/transactions/${transactionHash}`;
            }
            else {
                return `https://explorer.testnet.near.org/transactions/${transactionHash}`;
            }
        case "ETH":
            if (process.env.NETWORK === "mainnet") {
                return `https://etherscan.io/tx/${transactionHash}`;
            }
            else {
                return `https://${process.env.ETHERSCAN}.etherscan.io/tx/${transactionHash}`;
            }
        case "TRX":
            if (process.env.NETWORK === "mainnet") {
                return `https://tronscan.org/#/transaction/${transactionHash}`;
            }
            else {
                return `https://shasta.tronscan.org/#/transaction/${transactionHash}`;
            }
        case "BNB":
            if (process.env.NETWORK === "mainnet") {
                return `https://bscscan.com/tx/${transactionHash}`;
            }
            else {
                return `https://testnet.bscscan.com/tx/${transactionHash}`;
            }
        default:
            throw new Error(`Error blockchain '${blockchain}'`);
    }
};
