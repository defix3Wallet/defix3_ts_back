import { Request, Response } from "express";
// const fetch = require("node-fetch");
import fetch from "cross-fetch";

// list containing 'mainstream coins' ETH, WBTC, USDC, USDT, DAI, MIM and MAI
const mainstreamCoin = ["ETH", "WBTC", "USDC", "USDT", "DAI", "MIM", "MAI"];
export class BridgeController {
  public getFeeBridge = async (req: Request, res: Response) => {
    try {
      const { chainTo, amount, token, chainFrom } = req.body;
      // const chainTo = "AURORA";
      // const amount = 100000;
      // const token = "ETH";
      // const chainFrom = "BSC";

      const resp: any = await calculateBridgeFees(chainTo, amount, token, chainFrom);

      console.log("Token Fee:", resp.fee);
      console.log("Gas Fee:", resp.swapoutFee);
      res.json(resp);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
  };
}

// chainTo and chainFrom: 'ETH', 'BSC', 'AURORA'

// @param {number} amount - amount to swapout in dollars
// @param {boolean} isToETH - true if swapout to ETH
// @returns {number, number} - fee in dollars and cappedAmount to swapout
function calculateAltcoinBridgeFee(amount: any, isToETH: any) {
  const ethCrossChainFeePercentage = 0.001;
  const ethMinimumFee = 80;
  const ethMaximumFee = 1000;
  const nonEthCrossChainFeePercentage = 0.001;
  const minimumFee = 5;
  const maximumFee = 1000;
  const minimumAmountToEth = 90;
  const minimumAmount = 10;
  const maximumAmount = 5000000;

  let fee;
  let cappedFee;
  let cappedAmount;

  if (isToETH) {
    fee = amount * ethCrossChainFeePercentage;
    cappedFee = Math.max(Math.min(fee, ethMaximumFee), ethMinimumFee);
    cappedAmount = Math.max(Math.min(amount, maximumAmount), minimumAmountToEth);
  } else {
    fee = amount * nonEthCrossChainFeePercentage;
    cappedFee = Math.max(Math.min(fee, maximumFee), minimumFee);
    cappedAmount = Math.max(Math.min(amount, maximumAmount), minimumAmount);
  }

  return {
    fee: cappedFee,
    amount: cappedAmount,
  };
}

// @param {number} amount - amount to swapout in dollars
// @param {boolean} isToETH - true if swapout to ETH
// @returns {number, number} - fee in dollars and cappedAmount to swapout
function calculateMainstreamTokenBridgeFee(amount: any, isToETH: any) {
  const ethCrossChainFeePercentage = 0.001;
  const ethMinimumFee = 40;
  const ethMaximumFee = 1000;
  const nonEthCrossChainFee = 1.9;
  const minimumAmount = 12;
  const maximumAmount = 20000000;

  let fee;

  if (isToETH) {
    fee = amount * ethCrossChainFeePercentage;
    fee = Math.max(Math.min(fee, ethMaximumFee), ethMinimumFee);

    return {
      fee: fee,
      amount: Math.max(Math.min(amount, maximumAmount), minimumAmount),
    };
  } else {
    fee = nonEthCrossChainFee;
    return {
      fee: fee,
      amount: Math.max(Math.min(amount, maximumAmount), minimumAmount),
    };
  }
}

// api call to get bnb price in dollars
// @returns {number} - bnb price in dollars
const getBnbPrice = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
  const data: any = await response.json();
  const bnbPrice = data.binancecoin.usd;
  return bnbPrice;
};

// call to get transaction fees in bnb
// @returns {number} - transaction fees in bnb
const getBnbGasPrice = async () => {
  const response = await fetch("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=2D1NSZW8VQYMNKZKKF9QVTFKPCWQXTUWM3");
  const data: any = await response.json();
  const transactionFees = data.result.ProposeGasPrice;
  return transactionFees;
};

// @param {number} bnbPrice - current bnb price in dollars
// @param {number} transactionFees - current transaction fees in bnb
// @returns {number} - fee in dollars
const calculateBnbSwapoutFee = async (bnbPrice: any, transactionFees: any) => {
  // gas limit for anyswap swapout transactions
  const gasLimit = 100000;
  const gweiToEth = 1000000000;
  const fee = (transactionFees * gasLimit * bnbPrice) / gweiToEth;
  return fee;
};

// api call to get gasPrice in gwei
// @returns {number} - gas price in gwei
const getEthGasPrice = async () => {
  const response = await fetch("https://ethgasstation.info/json/ethgasAPI.json");
  const data: any = await response.json();
  const gasPrice = data.fast / 10;
  return gasPrice;
};

// api call to get eth price in dollars
// @returns {number} - eth price in dollars
const getEthPrice = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
  const data: any = await response.json();
  const ethPrice = data.ethereum.usd;
  return ethPrice;
};

// @param {number} gasPrice - current gas price in gwei
// @param {number} ethPrice - current eth price in dollars
// @returns {number} - fee in dollars
const calculateEthSwapoutFee = async (gasPrice: any, ethPrice: any) => {
  // gas limit for swapout transactions
  const gasLimit = 10000;
  // conversion rate from gwei to eth
  const gweiToEth = 1000000000;
  const fee = (gasPrice * gasLimit * ethPrice) / gweiToEth;
  return fee;
};

// aurora doesn't have fee market, charges 0.00001 ETH for swapout
const calculateAuroraSwapoutFee = async (ethPrice: any) => {
  const fee = 0.00001;
  return fee * ethPrice;
};

// calculate total fee for swapout
// @param {string} chainTo - chain to swapout to
// @param {number} amount - amount to swapout in dollars
// @param {string} token - token to swapout
// @param {string} chainFrom - chain to swapout from
// @returns {number, number} - {token fee, gas fee}
const calculateBridgeFees = async (chainTo: any, amount: any, token: any, chainFrom: any) => {
  let swapoutFee;
  if (chainFrom == "AURORA") {
    swapoutFee = await calculateAuroraSwapoutFee(await getEthPrice());
  } else if (chainFrom == "BSC") {
    swapoutFee = await calculateBnbSwapoutFee(await getBnbPrice(), await getBnbGasPrice());
  } else if (chainFrom == "ETH") {
    swapoutFee = await calculateEthSwapoutFee(await getEthGasPrice(), await getEthPrice());
  }
  if (mainstreamCoin.includes(token)) {
    const { fee } = calculateMainstreamTokenBridgeFee(amount, chainTo === "ETH");
    return { fee, swapoutFee };
  } else if (!mainstreamCoin.includes(token)) {
    const { fee } = calculateAltcoinBridgeFee(amount, chainTo === "ETH");
    return { fee, swapoutFee };
  }
};
