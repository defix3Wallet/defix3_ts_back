import { Request, Response } from "express";
// const fetch = require("node-fetch");
import fetch from "cross-fetch";
import path from "path";
import { ethers } from "ethers";
import abi from "./../anyswapV3Router.json";
import abiToken from "./../abi.json";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { AddressService } from "../../address/services/address.service";
import rawJson from "./../purifiedBridgeInfo.json";
import { TransactionHistoryService } from "../../transactionHistory/services/transactionHistory.service";
import { UtilsShared } from "../../../shared/utils/utils.shared";
import axios from "axios";

// URL for Binance Smart Chain provider
const bscProviderUrl = "https://bsc-dataseed.binance.org/";
// URL for Ethereum
const ethProviderUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
// URL for Aurora provider
const auroraProviderUrl = "https://mainnet.aurora.dev";

const jsonFragment = rawJson;

// list containing 'mainstream coins' ETH, WBTC, USDC, USDT, DAI, MIM and MAI
const mainstreamCoin = ["ETH", "WBTC", "USDC", "USDT", "DAI", "MIM", "MAI"];
export class BridgeService extends TransactionHistoryService {
  private addressService: AddressService;

  constructor() {
    super();
    this.addressService = new AddressService();
  }

  public getFeeBridge = async (chainTo: string, amount: string, coin: string, chainFrom: string) => {
    let toChain;
    if (chainTo === "ETH") {
      toChain = "ETH";
    } else if (chainTo === "BNB") {
      toChain = "BSC";
    } else if (chainTo === "NEAR") {
      toChain = "AURORA";
    }

    let fromChain;
    if (chainFrom === "ETH") {
      fromChain = "ETH";
    } else if (chainFrom === "BNB") {
      fromChain = "BSC";
    } else if (chainFrom === "NEAR") {
      fromChain = "AURORA";
    }

    if (!toChain || !fromChain) throw new Error("Error no chaind");

    const resp: any = await calculateBridgeFees(toChain, amount, coin, fromChain);

    return resp;
  };

  public getFeeLimitBridge = async (coin: string, chainFrom: string) => {
    let fromChain;
    if (chainFrom === "ETH") {
      fromChain = "ETH";
    } else if (chainFrom === "BNB") {
      fromChain = "BSC";
    } else if (chainFrom === "NEAR") {
      fromChain = "AURORA";
    }

    if (!fromChain) throw new Error("Error no chaind");

    const resp: any = await calculateBridgeLimits(coin, fromChain);

    return resp;
  };

  public getAddressesBridge = async (coin: string, blockchain: string) => {
    let chainId;
    if (blockchain === "ETH") {
      chainId = "1";
    } else if (blockchain === "BNB") {
      chainId = "56";
    } else if (blockchain === "NEAR") {
      chainId = "1313161554";
    }

    if (!chainId) return [];

    const result = getTokensBridge(chainId, coin);

    const result2 = getAddresses(chainId, coin);
    console.log(result2);

    return result;
  };

  public sendBridge = async (userAddress: string, key: string, coin: string, fromChain: string, toChain: string, amount: string, defixId: string) => {
    let fromAddress;

    if (defixId.includes(".defix3")) {
      fromAddress = (await this.addressService.getAddressByDefixId(defixId, fromChain))?.address;
    } else {
      fromAddress = defixId;
    }

    if (!fromAddress) throw new Error(`Invalid data.`);

    let chainId;
    console.log("AQUI VA 1");
    if (fromChain === "ETH") {
      chainId = "1";
    } else if (fromChain === "BNB") {
      chainId = "56";
    } else if (fromChain === "NEAR") {
      chainId = "1313161554";
    }

    let chainTo;
    if (toChain === "ETH") {
      chainTo = "1";
    } else if (toChain === "BNB") {
      chainTo = "56";
    } else if (toChain === "NEAR") {
      chainTo = "1313161554";
    }

    if (!chainId || !chainTo) return;

    console.log("AQUI VA 2");

    const addressesResult: any = await getAddresses(chainId, coin);
    const tokenAddressContract: any = await getTokenChainID(chainId, coin);
    console.log(addressesResult);
    console.log(tokenAddressContract);
    const tokenAddress = addressesResult.token;
    const contractAddress = addressesResult.router;
    const decimals = addressesResult.decimals;
    const decimaledAmount = ethers.utils.parseUnits(amount, decimals);
    const etheredChainId = ethers.BigNumber.from(Number(chainTo));

    console.log("AQUI VA 3");
    console.log(chainId);
    let providerUrl;
    if (chainId === "1") {
      providerUrl = ethProviderUrl;
    } else if (chainId === "56") {
      providerUrl = bscProviderUrl;
    } else if (chainId === "1313161554") {
      providerUrl = auroraProviderUrl;
    }
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    console.log(tokenAddress);

    console.log(providerUrl);
    console.log(provider);

    const contractToken = new ethers.Contract(tokenAddressContract, abiToken, provider);

    console.log(contractAddress, decimaledAmount);

    const signer = new ethers.Wallet(key, provider);

    console.log("BRR AQUI VA");

    const approve = await contractToken.connect(signer).approve(contractAddress, decimaledAmount);

    console.log("APPROVE", approve);

    const re = await approve.wait();

    console.log(re);

    const respTx = await swapOut(tokenAddress, decimaledAmount, userAddress, key, etheredChainId, provider, contract);

    const chain = fromChain + "/" + toChain;

    const transactionHistory: any = await this.createTransactionHistory({
      fromDefix: defixId,
      toDefix: userAddress,
      fromAddress: fromAddress,
      toAddress: userAddress,
      coin,
      blockchain: chain,
      amount: amount,
      hash: respTx.hash,
      typeTxn: "BRIDGE",
    });

    // transactionHistory.block = swapResult.block;
    transactionHistory.linkTxn = UtilsShared.getLinkTransaction(fromChain, respTx.hash);

    return transactionHistory;
  };
}

/*
 ******************** FUNCION PARA OBTENER ADDRESSES ********************
 */

async function swapIn(
  txhash: string,
  token: string,
  account: string,
  amount: string,
  key: string,
  fromChainID: ethers.BigNumber,
  provider: ethers.providers.JsonRpcProvider,
  contract: ethers.Contract
): Promise<any> {
  const signer = new ethers.Wallet(key, provider);
  const tx = await contract.connect(signer).anySwapInUnderlying(txhash, token, account, amount, fromChainID);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("Swapin transaction complete:", tx.hash);
}

async function swapOut(
  token: string,
  amount: ethers.BigNumber,
  bindaddr: string,
  key: string,
  toChainID: ethers.BigNumber,
  provider: ethers.providers.JsonRpcProvider,
  contract: ethers.Contract
): Promise<any> {
  console.log("AQUI VA 5");
  console.log(key, provider);
  const signer = new ethers.Wallet(key, provider);
  console.log("AQUI VA 6");
  console.log(token, bindaddr, amount, toChainID);
  const tx = await contract.connect(signer).anySwapOutUnderlying(token, bindaddr, amount, toChainID, {
    gasLimit: 100000,
  });
  console.log(tx);
  console.log("AQUI VA 7");
  const resu = await tx.wait(); // Wait for the transaction to be mined

  console.log("AQUI VA 8");
  console.log("Swapout transaction complete:", tx.hash);

  if (!tx.hash) throw new Error(`Failed to tx hash`);

  console.log(resu);

  return tx;
}

/*
 ******************** FUNCION PARA OBTENER ADDRESSES ********************
 */

async function getTokensBridge(chainId: string, anyTokenName: string) {
  // const response: any = axios.get("https://bridgeapi.multichain.org/v4/tokenlistv4/1");
  // const json: any = response.data;
  const json: any = jsonFragment;

  const tokensBridge: any = [];

  for (let contractType in json) {
    const obj = json[contractType];
    for (let startingChain in obj) {
      if (startingChain === chainId) {
        for (let address in obj[startingChain]) {
          const token = obj[startingChain][address]["underlying"];
          if (token.symbol === anyTokenName) {
            for (let chain of Object.keys(obj[startingChain][address]["destChains"])) {
              let tokenItem = obj[startingChain][address]["destChains"][chain];
              if (chain === "1") {
                tokenItem.blockchainCoin = "ETH";
                tokenItem.blockchain = "Ethereum";
              } else if (chain === "56") {
                tokenItem.blockchain = "Binance Smart Chain";
                tokenItem.blockchainCoin = "BNB";
              }
              // else if (chain === "1313161554") {
              //   tokenItem.blockchain = "Aurora";
              //   tokenItem.blockchainCoin = "AURORA";
              // }
              if (tokenItem.blockchain) {
                tokensBridge.push(tokenItem);
              }
            }
            return tokensBridge;
          }
        }
      }
    }
  }

  return tokensBridge;
}

function getTokenChainID(chainId: string, anyTokenName: string) {
  // const response: any = axios.get("https://bridgeapi.multichain.org/v4/tokenlistv4/1");
  // const json: any = response.data;
  const json: any = jsonFragment;

  for (let contractType in json) {
    const obj = json[contractType];
    for (let startingChain in obj) {
      if (startingChain === chainId) {
        for (let address in obj[startingChain]) {
          const token = obj[startingChain][address]["underlying"];
          if (token.symbol === anyTokenName) {
            return obj[startingChain][address].address;
          }
        }
      }
    }
  }
  return null;
}

function getAddresses(chainId: string, anyTokenName: string) {
  // const response: any = axios.get("https://bridgeapi.multichain.org/v4/tokenlistv4/1");
  // const json: any = response.data;
  const json: any = jsonFragment;

  for (let contractType in json) {
    const obj = json[contractType];
    for (let startingChain in obj) {
      if (startingChain === chainId) {
        for (let address in obj[startingChain]) {
          const token = obj[startingChain][address]["underlying"];
          if (token.symbol === anyTokenName) {
            return {
              router: obj[startingChain][address]["router"],
              token: obj[startingChain][address]["anyToken"]["address"],
              decimals: obj[startingChain][address]["anyToken"]["decimals"],
            };
          }
        }
      }
    }
  }
}

/*
 ******************** FUNCION PARA CALCULAR FEE ********************
 */

function calculateBridgeLimits(token: string, chain: string) {
  const altcoinMinFee = 5; // Minimum cross-chain fee for altcoins
  const altcoinMaxFee = 1000; // Maximum cross-chain fee for altcoins
  const altcoinMinAmount = 10; // Minimum cross-chain amount for altcoins
  const altcoinMaxAmount = 5000000; // Maximum cross-chain amount for altcoins
  const altcoinMaxAmountDelay = 12; // Maximum delay for cross-chain amount larger than $1M for altcoins (in hours)

  const altcoinEthMinFee = 80; // Minimum cross-chain fee for altcoins
  const altcoinEthMaxFee = 1000; // Maximum cross-chain fee for altcoins
  const altcoinEthMinAmount = 90; // Minimum cross-chain amount for altcoins
  const altcoinEthMaxAmount = 5000000; // Maximum cross-chain amount for altcoins
  const altcoinEthMaxAmountDelay = 12; // Maximum delay for cross-chain amount larger than $1M for altcoins (in hours)

  const ethMinFee = 40; // Minimum cross-chain fee to ETH for mainstream tokens
  const ethMaxFee = 1000; // Maximum cross-chain fee to ETH for mainstream tokens
  const ethMinAmount = 12; // Minimum cross-chain amount to ETH for mainstream tokens
  const ethMaxAmount = 20000000; // Maximum cross-chain amount to ETH for mainstream tokens
  const ethMaxAmountDelay = 12; // Maximum delay for cross-chain amount larger than $5M to ETH (in hours)

  const nonEthMinFee = 0.9; // Minimum cross-chain fee to non-ETH chains for mainstream tokens
  const nonEthMaxFee = 1.9; // Maximum cross-chain fee to non-ETH chains for mainstream tokens
  const nonEthMinAmount = 12; // Minimum cross-chain amount to non-ETH chains for mainstream tokens
  const nonEthMaxAmount = 20000000; // Maximum cross-chain amount to non-ETH chains for mainstream tokens
  const nonEthMaxAmountDelay = 12; // Maximum delay for cross-chain amount larger than $5M to non-ETH chains (in hours)

  let minAmount, maxAmount, minFee, maxFee, maxDelay;

  if (chain === "ETH") {
    if (mainstreamCoin.includes(token)) {
      minAmount = ethMinAmount;
      maxAmount = ethMaxAmount;
      minFee = ethMinFee;
      maxFee = ethMaxFee;
      maxDelay = maxAmount > 5000000 ? ethMaxAmountDelay : 0;
    } else {
      minAmount = altcoinEthMinAmount;
      maxAmount = altcoinEthMaxAmount;
      minFee = altcoinEthMinFee;
      maxFee = altcoinEthMaxFee;
      maxDelay = maxAmount > 1000000 ? altcoinEthMaxAmountDelay : 0;
    }
  } else {
    if (mainstreamCoin.includes(token)) {
      minAmount = nonEthMinAmount;
      maxAmount = nonEthMaxAmount;
      minFee = nonEthMinFee;
      maxFee = nonEthMaxFee;
      maxDelay = maxAmount > 5000000 ? nonEthMaxAmountDelay : 0;
    } else {
      minAmount = altcoinMinAmount;
      maxAmount = altcoinMaxAmount;
      minFee = altcoinMinFee;
      maxFee = altcoinMaxFee;
      maxDelay = maxAmount > 1000000 ? altcoinMaxAmountDelay : 0;
    }
  }

  return {
    minAmount,
    maxAmount,
    minFee,
    maxFee,
    maxDelay,
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
