"use strict";
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
UtilsShared.getTokenContract = async (token, blockchain) => {
    try {
        const conexion = await (0, postgres_1.default)();
        const response = await conexion.query("SELECT *\
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
};
UtilsShared.getComision = async (coin) => {
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
};
UtilsShared.getAddressUser = async (defixId, blockchain) => {
    try {
        const address = await address_entity_1.AddressEntity.findOneBy({
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
};
UtilsShared.getCryptos = async () => {
    try {
        const conexion = await (0, postgres_1.default)();
        const cryptocurrencys = await conexion.query("select * from backend_cryptocurrency");
        const cryptos = [];
        for (let cryptocurrency of cryptocurrencys.rows) {
            const tokens = await conexion.query("select * from backend_token where cryptocurrency_id = $1", [cryptocurrency.id]);
            cryptocurrency.tokens = tokens.rows;
            cryptos.push(cryptocurrency);
        }
        return cryptos;
    }
    catch (error) {
        console.log(error);
        return [];
    }
};
UtilsShared.validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
};
UtilsShared.getIdNear = async (mnemonic) => {
    const walletSeed = await nearSEED.parseSeedPhrase(mnemonic);
    const split = String(walletSeed.publicKey).split(":");
    const id = String(split[1]);
    return id;
};
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
