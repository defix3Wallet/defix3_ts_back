"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const process = require("process");
const ProcessFn = async () => {
    try {
        const response = await axios_1.default.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=weth%2Cnear%2Cwbnb%2Ctron%2Cwrapped-tron%2Cbinance-usd%2Cbitcoin%2Cethereum%2Ctether%2Cbinancecoin%2Cwrapped-bitcoin%2Cusd-coin%2Cdai&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d");
        if (response.data) {
            if (response.data.length > 0) {
                // console.log(response.data[0]);
                process.send(response.data);
            }
        }
    }
    catch (error) {
        // console.log("err")
    }
};
const startProcess = () => {
    ProcessFn();
    setInterval(async () => {
        ProcessFn();
    }, 60000);
};
startProcess();
