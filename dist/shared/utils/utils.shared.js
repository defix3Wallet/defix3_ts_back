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
const postgres_1 = __importDefault(require("../../config/postgres"));
const address_entity_1 = require("../../modules/address/entities/address.entity");
const nearSEED = require("near-seed-phrase");
const NETWORK = process.env.NETWORK || "testnet";
class UtilsShared {
    static ConfigNEAR(keyStores) {
        switch (NETWORK) {
            case "mainnet":
                return {
                    networkId: "mainnet",
                    nodeUrl: "https://rpc.mainnet.near.org",
                    keyStore: keyStores,
                    walletUrl: "https://wallet.near.org",
                    helperUrl: "https://helper.mainnet.near.org",
                    explorerUrl: "https://explorer.mainnet.near.org",
                };
            case "testnet":
                return {
                    networkId: "testnet",
                    keyStore: keyStores,
                    nodeUrl: "https://rpc.testnet.near.org",
                    walletUrl: "https://wallet.testnet.near.org",
                    helperUrl: "https://helper.testnet.near.org",
                    explorerUrl: "https://explorer.testnet.near.org",
                };
            default:
                throw new Error(`Unconfigured environment '${NETWORK}'`);
        }
    }
}
exports.UtilsShared = UtilsShared;
_a = UtilsShared;
UtilsShared.getAddressUser = (defixId, blockchain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield address_entity_1.AddressEntity.findOneBy({
            user: { defix_id: defixId },
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
