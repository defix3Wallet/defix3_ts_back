import { BlockchainService } from "../blockchain.interface";
import { ethers, Wallet } from "ethers";
import Web3 from "web3";
import web3Utils from "web3-utils";
import { CredentialInterface } from "../../interfaces/credential.interface";
import axios from "axios";
import { constructCancelLimitOrder, constructGetLimitOrders, constructSimpleSDK, OptimalRate, SwapSide } from "@paraswap/sdk";
import abi from "../abi.json";
import { UtilsShared } from "../../shared/utils/utils.shared";
import {
  // swap methods
  constructPartialSDK,
  constructEthersContractCaller,
  constructAxiosFetcher,
  // limitOrders methods
  constructBuildLimitOrder,
  constructSignLimitOrder,
  constructPostLimitOrder,
  // extra types
  SignableOrderData,
  LimitOrderToSend,
} from "@paraswap/sdk";

const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ETHERSCAN = process.env.ETHERSCAN;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`));

const paraSwap = constructSimpleSDK({
  chainId: Number(process.env.PARASWAP_ETH),
  axios,
});

const dataToken = {
  decimals: 18,
  contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};

const fetcher = constructAxiosFetcher(axios);
const provider = ethers.getDefaultProvider(1);

export class EthereumService implements BlockchainService {
  async fromMnemonic(mnemonic: string): Promise<CredentialInterface> {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    const credential: CredentialInterface = {
      name: "ETH",
      address: wallet.address,
      privateKey: wallet.privateKey,
    };

    return credential;
  }
  async fromPrivateKey(privateKey: string): Promise<CredentialInterface | null> {
    try {
      const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
      const credential: CredentialInterface = {
        name: "ETH",
        address: wallet.address,
        privateKey: privateKey,
      };

      return credential;
    } catch (error) {
      return null;
    }
  }
  async isAddress(address: string): Promise<boolean> {
    return await web3.utils.isAddress(address);
  }
  async getBalance(address: string): Promise<number> {
    try {
      let balance = await web3.eth.getBalance(address);

      let balanceTotal = 0;

      if (balance) {
        let value = Math.pow(10, 18);
        balanceTotal = Number(balance) / value;
        if (!balanceTotal) {
          balanceTotal = 0;
        }
        return balanceTotal;
      } else {
        return balanceTotal;
      }
    } catch (error) {
      return 0;
    }
  }

  async getBalanceToken(address: string, srcContract: string, decimals: number): Promise<number> {
    try {
      let contract = new web3.eth.Contract(abi as web3Utils.AbiItem[], srcContract);

      const balance = await contract.methods.balanceOf(address).call();

      console.log(balance);

      let balanceTotal = 0;

      if (balance) {
        let value = Math.pow(10, decimals);
        balanceTotal = balance / value;
        if (!balanceTotal) {
          balanceTotal = 0;
        }
        return balanceTotal;
      } else {
        return balanceTotal;
      }
    } catch (error) {
      return 0;
    }
  }

  async getFeeTransaction(coin: string, blockchain: string, typeTxn: string): Promise<any> {
    try {
      let comisionAdmin: any = await UtilsShared.getComision(coin);

      const response = await axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6");
      const wei = response.data.result.SafeGasPrice;

      if (!wei) throw new Error(`Error getting gas price`);

      const feeMain = {
        coin,
        blockchain,
        fee: "",
      };

      let gasLimit = 21000;
      if (coin !== "ETH") {
        gasLimit = 55000;
      }

      let comision;

      if (typeTxn === "TRANSFER") {
        comision = comisionAdmin.transfer;
      } else if (typeTxn === "WITHDRAW") {
        comision = comisionAdmin.withdraw;
      }

      if (!comision) {
        feeMain.fee = web3.utils.fromWei(String(gasLimit * wei), "gwei");
      } else {
        feeMain.fee = String(Number(web3.utils.fromWei(String(gasLimit * wei), "gwei")) * 2);
      }
      return feeMain;
    } catch (err: any) {
      throw new Error(`Failed to get fee transaction, ${err.message}`);
    }
  }

  async sendTransfer(fromAddress: string, privateKey: string, toAddress: string, amount: number, coin: string): Promise<string> {
    try {
      const balance = await this.getBalance(fromAddress);
      if (balance < amount) {
        throw new Error(`Error: You do not have enough funds to make the transfer`);
      }

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000;
      const nonce = await web3.eth.getTransactionCount(fromAddress);

      const rawTransaction = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(web3.utils.toWei(amount.toLocaleString("fullwide", { useGrouping: false }), "ether")),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        nonce: nonce,
      };

      const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);

      if (!signedTransaction.rawTransaction) throw new Error(`Error: Failed to sign transaction`);

      const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

      if (!transactionHash.transactionHash) throw new Error(`Error: Failed to send transaction`);

      return transactionHash.transactionHash;

      // const response = await axios.get(
      //   "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6"
      // );
      // let wei = response.data.result.SafeGasPrice;
      // let fee = Number(web3.utils.fromWei(String(21000 * wei), "gwei"));

      // const resp_comision = await GET_COMISION(coin);
      // const vault_address = await ADDRESS_VAULT(coin);

      // const comision = resp_comision.transfer / 100;

      // let amount_vault = Number((fee * comision).toFixed(18));

      // console.log(amount_vault, vault_address);

      // if (amount_vault !== 0 && vault_address) {
      //   await payCommissionETH(
      //     fromAddress,
      //     privateKey,
      //     vault_address,
      //     amount_vault
      //   );
      // }

      // if (!transactionHash.transactionHash) return false;

      // return transactionHash.transactionHash as string;
    } catch (err: any) {
      console.log(err);
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  async sendTransferToken(fromAddress: string, privateKey: string, toAddress: string, amount: number, srcToken: any): Promise<string> {
    try {
      const balance = await this.getBalanceToken(fromAddress, srcToken.contract, srcToken.decimals);
      if (balance < amount) {
        throw new Error(`Error: You do not have enough funds to make the transfer`);
      }

      const provider = new ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_PROJECT_ID);

      const minABI = abi;

      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);

      const contract = new ethers.Contract(srcToken.contract, minABI, signer);
      let value = Math.pow(10, srcToken.decimals);
      let srcAmount = amount * value;

      const tx = await contract.transfer(toAddress, srcAmount.toLocaleString("fullwide", { useGrouping: false }));

      if (!tx.hash) throw new Error(`Error tx hash.`);

      return tx.hash as string;
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  async previewSwap(fromCoin: string, toCoin: string, amount: number, blockchain: string, address: string): Promise<any> {
    try {
      let fromToken: any = await UtilsShared.getTokenContract(fromCoin, blockchain);
      let toToken: any = await UtilsShared.getTokenContract(toCoin, blockchain);

      if (!fromToken) {
        fromToken = dataToken;
      }
      if (!toToken) {
        toToken = dataToken;
      }

      let value = Math.pow(10, fromToken.decimals);
      const srcAmount = amount * value;

      const priceRoute: OptimalRate = await paraSwap.swap.getRate({
        srcToken: fromToken.contract,
        destToken: toToken.contract,
        amount: srcAmount.toLocaleString("fullwide", { useGrouping: false }),
      });

      const response = await axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6");
      let wei = response.data.result.SafeGasPrice;

      const comision = await UtilsShared.getComision(blockchain);

      let feeTransfer = "0";
      let porcentFee = 0;

      if (comision.swap) {
        porcentFee = comision.swap / 100;
        if (comision.swap && fromCoin === "ETH") {
          feeTransfer = web3.utils.fromWei(String(21000 * wei), "gwei");
        } else {
          feeTransfer = web3.utils.fromWei(String(55000 * wei), "gwei");
        }
      }
      const feeGas = web3.utils.fromWei(String(Number(priceRoute.gasCost) * wei), "gwei");

      const srcFee = String(Number(feeTransfer) + Number(feeGas));

      let feeDefix = String(Number(srcFee) * porcentFee);

      const swapRate = String(
        Number(priceRoute.destAmount) / Math.pow(10, toToken.decimals) / (Number(priceRoute.srcAmount) / Math.pow(10, fromToken.decimals))
      );

      const dataSwap = {
        exchange: priceRoute.bestRoute[0].swaps[0].swapExchanges[0].exchange,
        fromAmount: priceRoute.srcAmount,
        fromDecimals: fromToken.decimals,
        toAmount: priceRoute.destAmount,
        toDecimals: toToken.decimals,
        block: priceRoute.blockNumber,
        swapRate,
        contract: priceRoute.contractAddress,
        fee: srcFee,
        feeDefix: feeDefix,
        feeTotal: String(Number(srcFee) + Number(feeDefix)),
      };

      return { dataSwap, priceRoute };
    } catch (err: any) {
      throw new Error(`Failed to get preview, ${err.message}`);
    }
  }

  async sendSwap(priceRoute: any, privateKey: string, address: string): Promise<any> {
    try {
      const signer = web3.eth.accounts.privateKeyToAccount(privateKey);

      const txParams = await paraSwap.swap.buildTx({
        srcToken: priceRoute.srcToken,
        destToken: priceRoute.destToken,
        srcAmount: priceRoute.srcAmount,
        destAmount: priceRoute.destAmount,
        priceRoute: priceRoute,
        userAddress: address,
      });

      const txSigned = await signer.signTransaction(txParams);

      if (!txSigned.rawTransaction) throw new Error(`Failed to sign swap.`);

      const result = await web3.eth.sendSignedTransaction(txSigned.rawTransaction);

      const transactionHash = result.transactionHash;

      if (!transactionHash) throw new Error(`Failed to send swap, transaction Hash.`);

      const srcAmount = String(Number(priceRoute.srcAmount) / Math.pow(10, priceRoute.srcDecimals));
      const destAmount = String(Number(priceRoute.destAmount) / Math.pow(10, priceRoute.destDecimals));

      return {
        transactionHash,
        srcAmount: srcAmount,
        destAmount: destAmount,
        block: priceRoute.blockNumber,
      };
    } catch (err: any) {
      throw new Error(`Failed to send swap, ${err.message}`);
    }
  }

  public sendLimitOrder = async (
    fromCoin: string,
    toCoin: string,
    srcAmount: number,
    destAmount: number,
    blockchain: string,
    address: string,
    privateKey: string
  ) => {
    try {
      const signer = new ethers.Wallet(privateKey, provider);
      const account = signer.address;
      const contractCaller = constructEthersContractCaller(
        {
          ethersProviderOrSigner: signer,
          EthersContract: ethers.Contract,
        },
        account
      );

      const paraSwapLimitOrderSDK = constructPartialSDK(
        {
          chainId: 1,
          fetcher,
          contractCaller,
        },
        constructBuildLimitOrder,
        constructSignLimitOrder,
        constructPostLimitOrder
      );

      console.log(privateKey);

      let fromToken: any = await UtilsShared.getTokenContract(fromCoin, blockchain);
      let toToken: any = await UtilsShared.getTokenContract(toCoin, blockchain);

      if (!fromToken) {
        fromToken = dataToken;
      }
      if (!toToken) {
        toToken = dataToken;
      }

      let fromValue = Math.pow(10, fromToken.decimals);
      const srcAmountLimit = Math.round(srcAmount * fromValue);

      let toValue = Math.pow(10, toToken.decimals);
      const destAmountLimit = Math.round(destAmount * toValue);

      const orderInput = {
        nonce: 1,
        expiry: 0, //Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // week from now, in sec
        makerAsset: fromToken.contract,
        takerAsset: toToken.contract,
        makerAmount: srcAmountLimit.toLocaleString("fullwide", { useGrouping: false }),
        takerAmount: destAmountLimit.toLocaleString("fullwide", { useGrouping: false }),
        maker: account,
      };

      const signableOrderData: SignableOrderData = await paraSwapLimitOrderSDK.buildLimitOrder(orderInput);

      console.log(signableOrderData);

      // const signature = await signer._signTypedData(signableOrderData.domain, signableOrderData.types, signableOrderData.data);

      const signature: string = await paraSwapLimitOrderSDK.signLimitOrder(signableOrderData);

      console.log(signature);

      const orderToPostToApi: LimitOrderToSend = {
        ...signableOrderData.data,
        signature,
      };
      console.log(orderToPostToApi);

      const newOrder = await paraSwapLimitOrderSDK.postLimitOrder(orderToPostToApi);
      console.log(newOrder);

      return newOrder;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to send order limit, ${error.message}`);
    }
  };

  public getAllLimitOrder = async (address: string) => {
    try {
      const web3Main = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

      address = "0x856d78cde2a7e361bf528c72c5d130bc0da91e58";
      const paraSwapLimitOrderSDK = constructPartialSDK(
        {
          chainId: 1,
          fetcher,
        },
        constructGetLimitOrders
      );

      const ordersData = await paraSwapLimitOrderSDK.getLimitOrders({
        maker: address,
        type: "LIMIT",
      });

      const orders: any[] = [];

      for (let order of ordersData.orders) {
        let orderFin: any = order;
        const makerContract = new web3Main.eth.Contract(abi as web3Utils.AbiItem[], order.makerAsset);

        const fromSymbol = await makerContract.methods.symbol().call();
        const fromDecimals = await makerContract.methods.decimals().call();
        // const fromName = await makerContract.methods.name().call();

        const takerContract = new web3Main.eth.Contract(abi as web3Utils.AbiItem[], order.takerAsset);

        const toSymbol = await takerContract.methods.symbol().call();
        const toDecimals = await takerContract.methods.decimals().call();
        // const toName = await takerContract.methods.name().call();

        orderFin.blockchain = "ETHEREUM";
        orderFin.blockchainCoin = "ETH";

        orderFin.fromSymbol = fromSymbol;
        orderFin.toSymbol = toSymbol;

        console.log();

        orderFin.fromAmount = Number(orderFin.makerAmount) / Math.pow(10, fromDecimals);
        orderFin.toAmount = Number(orderFin.takerAmount) / Math.pow(10, toDecimals);

        orderFin.linkHash = UtilsShared.getLinkTransaction(orderFin.blockchainCoin, orderFin.orderHash);

        orders.push(orderFin);
      }

      return orders;
    } catch (error: any) {
      throw new Error(`Failed to get all order limit, ${error.message}`);
    }
  };

  public cancelLimitOrder = async (orderHash: string, privateKey: string) => {
    try {
      const signer = new ethers.Wallet(privateKey, provider);
      const account = signer.address;

      const contractCaller = constructEthersContractCaller(
        {
          ethersProviderOrSigner: signer,
          EthersContract: ethers.Contract,
        },
        account
      );

      const paraSwapLimitOrderSDK = constructPartialSDK(
        {
          chainId: 1,
          fetcher,
          contractCaller,
        },
        constructGetLimitOrders,
        constructCancelLimitOrder
      );

      const deleteTx: ethers.ContractTransaction = await paraSwapLimitOrderSDK.cancelLimitOrder(orderHash);

      console.log("deleteTx", deleteTx);

      return deleteTx;
    } catch (error: any) {
      throw new Error(`Failed to cancel order limit, ${error.message}`);
    }
  };

  public getOrderBookCoinToCoin = async (fromCoin: string, toCoin: string) => {
    try {
      const web3Main = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

      const ordersData = await axios.get("https://api.paraswap.io/ft/orders/1/orderbook/?makerAsset=" + fromCoin + "&takerAsset=" + toCoin);

      const orders: any[] = [];

      for (let order of ordersData.data.orders) {
        let orderFin: any = order;
        const makerContract = new web3Main.eth.Contract(abi as web3Utils.AbiItem[], order.makerAsset);

        const fromSymbol = await makerContract.methods.symbol().call();
        const fromDecimals = await makerContract.methods.decimals().call();
        // const fromName = await makerContract.methods.name().call();

        const takerContract = new web3Main.eth.Contract(abi as web3Utils.AbiItem[], order.takerAsset);

        const toSymbol = await takerContract.methods.symbol().call();
        const toDecimals = await takerContract.methods.decimals().call();
        // const toName = await takerContract.methods.name().call();

        orderFin.blockchain = "ETHEREUM";
        orderFin.blockchainCoin = "ETH";

        orderFin.fromSymbol = fromSymbol;
        orderFin.toSymbol = toSymbol;

        orderFin.fromAmount = Number(orderFin.makerAmount) / Math.pow(10, fromDecimals);
        orderFin.toAmount = Number(orderFin.takerAmount) / Math.pow(10, toDecimals);

        orderFin.linkHash = UtilsShared.getLinkTransaction(orderFin.blockchainCoin, orderFin.orderHash);

        orders.push(orderFin);
      }

      return orders;
    } catch (error: any) {
      throw new Error(`Failed to get order book, ${error.message}`);
    }
  };
}
