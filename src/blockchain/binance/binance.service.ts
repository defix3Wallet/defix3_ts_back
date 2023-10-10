import { BlockchainService } from "../blockchain.interface";
import { ethers, Wallet } from "ethers";
import Web3 from "web3";
import web3Utils from "web3-utils";
import { AbiItem } from "web3-utils";
import { CredentialInterface } from "../../interfaces/credential.interface";
import axios from "axios";
import { constructSimpleSDK, OptimalRate } from "@paraswap/sdk";
import abi from "../abi.json";
import { UtilsShared } from "../../shared/utils/utils.shared";

const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ETHERSCAN = process.env.ETHERSCAN;

const WEB_BSC = process.env.WEB_BSC;

const web3 = new Web3(new Web3.providers.HttpProvider(WEB_BSC || ""));

const paraSwap = constructSimpleSDK({
  chainId: Number(process.env.PARASWAP_BNB),
  axios,
});

const dataToken = {
  decimals: 18,
  contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};

export class BinanceService implements BlockchainService {
  getOrderBookCoinToCoin(fromCoin: string, toCoin: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  sendLimitOrder(
    fromCoin: string,
    toCoin: string,
    srcAmount: number,
    destAmount: number,
    blockchain: string,
    address: string,
    privateKey: string
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async fromMnemonic(mnemonic: string): Promise<CredentialInterface> {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    const credential: CredentialInterface = {
      name: "BNB",
      address: wallet.address,
      privateKey: wallet.privateKey,
    };

    return credential;
  }
  async fromPrivateKey(privateKey: string): Promise<CredentialInterface | null> {
    try {
      const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
      const credential: CredentialInterface = {
        name: "BNB",
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
      console.log(error);
      return 0;
    }
  }

  async getBalanceToken(address: string, srcContract: string, decimals: number): Promise<number> {
    try {
      let contract = new web3.eth.Contract(abi as web3Utils.AbiItem[], srcContract);

      const balance = await contract.methods.balanceOf(address).call();

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
      let comisionAdmin: any = await UtilsShared.getComision(blockchain);

      const response = await axios.get("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=3SU1MAWAPX8X39UD6U8JBGTQ5C67EVVRSM");
      const wei = response.data.result.SafeGasPrice;

      if (!wei) throw new Error(`Error getting gas price`);

      const feeMain = {
        coin,
        blockchain,
        fee: "",
      };

      let gasLimit = 21000;
      if (coin !== "BNB") {
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
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  async sendTransferToken(fromAddress: string, privateKey: string, toAddress: string, amount: number, srcToken: any): Promise<string> {
    try {
      const balance = await this.getBalanceToken(fromAddress, srcToken.contract, srcToken.decimals);
      if (balance < amount) {
        throw new Error(`Error: You do not have enough funds to make the transfer`);
      }

      // const provider = new ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_PROJECT_ID);

      const provider = new ethers.providers.JsonRpcProvider(WEB_BSC); // provider for signing transaction
      let wallet = new ethers.Wallet(privateKey, provider);

      const minABI = abi;

      // const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);

      const contract = new ethers.Contract(srcToken.contract, minABI, signer);
      let value = Math.pow(10, srcToken.decimals);
      let srcAmount = amount * value;

      const tx = await contract.transfer(toAddress, srcAmount.toLocaleString("fullwide", { useGrouping: false }));

      const txWait = await tx.wait();

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

      const response = await axios.get("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=3SU1MAWAPX8X39UD6U8JBGTQ5C67EVVRSM");
      let wei = response.data.result.SafeGasPrice;

      const comision = await UtilsShared.getComision(blockchain);

      let feeTransfer = "0";
      let porcentFee = 0;

      if (comision.swap) {
        porcentFee = comision.swap / 100;
        if (comision.swap && fromCoin === "BNB") {
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
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  async sendSwap(priceRoute: any, privateKey: string, address: string): Promise<any> {
    try {
      // const provider = ethers.getDefaultProvider(56);
      if (priceRoute.srcToken !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        const provider = new ethers.providers.JsonRpcProvider(WEB_BSC);
        const signerApprove = new ethers.Wallet(privateKey, provider);
        const account = signerApprove.address;

        const contractToken = new ethers.Contract(priceRoute.srcToken, abi, signerApprove);

        const allowance = await contractToken.allowance(account, priceRoute.tokenTransferProxy);

        // if (allowance > priceRoute.srcAmount) {
        const gasPrice = await signerApprove.getGasPrice();

        const gasLimit = await contractToken.estimateGas.approve(priceRoute.tokenTransferProxy, priceRoute.srcAmount);

        const approve = await contractToken.connect(signerApprove).approve(priceRoute.tokenTransferProxy, priceRoute.srcAmount, {
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        });

        console.log("APPROVE", approve);

        await approve.wait();
      }
      // }

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
  cancelLimitOrder(address: string, privateKey: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAllLimitOrder(address: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
