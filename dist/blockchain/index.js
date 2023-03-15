"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchainService = void 0;
const ethereum_service_1 = require("./ethereum/ethereum.service");
const binance_service_1 = require("./binance/binance.service");
const bitcoin_service_1 = require("./bitcoin/bitcoin.service");
const near_service_1 = require("./near/near.service");
const tron_service_1 = require("./tron/tron.service");
exports.blockchainService = {
    btc: new bitcoin_service_1.BitcoinService(),
    eth: new ethereum_service_1.EthereumService(),
    bnb: new binance_service_1.BinanceService(),
    near: new near_service_1.NearService(),
    trx: new tron_service_1.TronService(),
};
