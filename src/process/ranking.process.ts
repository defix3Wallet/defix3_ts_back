import axios from "axios";
const process = require("process");

const ProcessFn = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=weth%2Cnear%2Ctron%2Cbitcoin%2Cethereum%2Ctether%2Cbinancecoin%2Cwrapped-bitcoin%2Cusd-coin%2Cdai&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
    );

    if (response.data) {
      if (response.data.length > 0) {
        // console.log(response.data[0]);
        process.send(response.data);
      }
    }
  } catch (error) {
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
