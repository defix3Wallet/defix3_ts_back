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

// URL for Binance Smart Chain provider
const bscProviderUrl = "https://bsc-dataseed.binance.org/";
// URL for Ethereum
const ethProviderUrl = "https://mainnet.infura.io/v3/6b1b6f6b0f7a4b6e8b3b3b0f0f0f0f0f";
// URL for Aurora provider
const auroraProviderUrl = "https://mainnet.aurora.dev";

const jsonFragment = rawJson;

// list containing 'mainstream coins' ETH, WBTC, USDC, USDT, DAI, MIM and MAI
const mainstreamCoin = ["ETH", "WBTC", "USDC", "USDT", "DAI", "MIM", "MAI"];
export class BridgeController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  public getFeeBridge = async (req: Request, res: Response) => {
    try {
      const { chainTo, amount, coin, chainFrom } = req.body;
      // const chainTo = "AURORA";
      // const amount = 100000;
      // const token = "ETH";
      // const chainFrom = "BSC";

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

      console.log("Token Fee:", resp);
      console.log("Gas Fee:", resp.swapoutFee);
      res.json(resp);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
  };

  public getAddressesBridge = async (req: Request, res: Response) => {
    try {
      const { coin, blockchain } = req.body;
      let chainId;
      if (blockchain === "ETH") {
        chainId = "1";
      } else if (blockchain === "BNB") {
        chainId = "56";
      } else if (blockchain === "NEAR") {
        chainId = "1313161554";
      }

      if (!chainId) throw new Error("Error no chaind ID");

      const result = getTokensBridge(chainId, coin);
      console.log(result);

      // const result2 = getAddresses(chainId, token);
      // console.log(result2);

      res.json(result);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
  };

  public sendBridge = async (req: Request, res: Response) => {
    try {
      const { defixId, pkEncrypt, toAddress, coin, amount, fromChain, toChain } = req.body;

      if (!defixId || !pkEncrypt || !toAddress || !coin || !amount || !fromChain || !toChain)
        return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      let fromAddress;

      if (defixId.includes(".defix3")) {
        fromAddress = (await this.addressService.getAddressByDefixId(defixId, fromChain))?.address;
      } else {
        fromAddress = defixId;
      }

      if (!fromAddress) throw new Error(`Invalid data.`);

      const result = await sendBridgeFN(toAddress, privateKey, coin, fromChain, toChain, amount);
      console.log(result);

      // const result2 = getAddresses(chainId, token);
      // console.log(result2);

      res.json(result);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
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
): Promise<void> {
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
): Promise<void> {
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

  console.log(resu);

  return resu;
}

async function sendBridgeFN(userAddress: string, key: string, coin: string, fromChain: string, toChain: string, amount: string): Promise<void> {
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
  console.log(addressesResult);
  const tokenAddress = addressesResult.token;
  const contractAddress = addressesResult.router;
  const decimals = addressesResult.decimals;
  const decimaledAmount = ethers.utils.parseUnits(amount, decimals);
  const etheredChainId = ethers.BigNumber.from(Number(chainTo));

  console.log("AQUI VA 3");
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

  const contractToken = new ethers.Contract(tokenAddress, abiToken, provider);

  console.log(contractAddress, decimaledAmount);

  const signer = new ethers.Wallet(key, provider);

  const approve = await contractToken.connect(signer).approve(contractAddress, decimaledAmount);

  console.log("APPROVE", approve);

  const re = await approve.wait();

  console.log(re);

  console.log("AQUI VA 4");
  return await swapOut(tokenAddress, decimaledAmount, userAddress, key, etheredChainId, provider, contract);
}

/*
 ******************** FUNCION PARA OBTENER ADDRESSES ********************
 */

function getTokensBridge(chainId: string, anyTokenName: string) {
  const json: any = jsonFragment;

  const tokensBridge: any = [];

  for (let contractType in json) {
    const obj = json[contractType];
    for (let startingChain in obj) {
      if (startingChain === chainId) {
        for (let address in obj[startingChain]) {
          const token = obj[startingChain][address]["underlying"];
          if (token.symbol === anyTokenName) {
            return obj[startingChain][address]["destChains"];
          }
        }
      }
    }
  }

  return tokensBridge;
}

function getAddresses(chainId: string, anyTokenName: string) {
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
