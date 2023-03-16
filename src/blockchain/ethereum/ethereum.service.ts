import { BlockchainService } from "../blockchain.interface";
import { ethers, Wallet } from "ethers";
import Web3 from "web3";
import web3Utils from "web3-utils";
import { CredentialInterface } from "../../interfaces/credential.interface";
import axios from "axios";
import { constructSimpleSDK, OptimalRate } from "@paraswap/sdk";
import abi from "../abi.json";
import { UtilsShared } from "../../shared/utils/utils.shared";

const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ETHERSCAN = process.env.ETHERSCAN;

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`
  )
);

const dataToken = {
  decimals: 18,
  contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};

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
  async fromPrivateKey(
    privateKey: string
  ): Promise<CredentialInterface | null> {
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

  async getBalanceToken(
    address: string,
    srcContract: string,
    decimals: number
  ): Promise<number> {
    try {
      let contract = new web3.eth.Contract(
        abi as web3Utils.AbiItem[],
        srcContract
      );

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

  async sendTransfer(
    fromAddress: string,
    privateKey: string,
    toAddress: string,
    amount: number,
    coin: string
  ): Promise<string> {
    try {
      const balance = await this.getBalance(fromAddress);
      if (balance < amount) {
        throw new Error(
          `Error: You do not have enough funds to make the transfer`
        );
      }

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000;
      const nonce = await web3.eth.getTransactionCount(fromAddress);

      const rawTransaction = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether")),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        nonce: nonce,
      };

      const signedTransaction = await web3.eth.accounts.signTransaction(
        rawTransaction,
        privateKey
      );

      if (!signedTransaction.rawTransaction)
        throw new Error(`Error: Failed to sign transaction`);

      const transactionHash = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );

      if (!transactionHash.transactionHash)
        throw new Error(`Error: Failed to send transaction`);

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

  async sendTransferToken(
    fromAddress: string,
    privateKey: string,
    toAddress: string,
    amount: number,
    srcToken: any
  ): Promise<string> {
    try {
      const balance = await this.getBalanceToken(
        fromAddress,
        srcToken.contract,
        srcToken.decimals
      );
      if (balance < amount) {
        throw new Error(
          `Error: You do not have enough funds to make the transfer`
        );
      }

      const provider = new ethers.providers.InfuraProvider(
        ETHEREUM_NETWORK,
        INFURA_PROJECT_ID
      );

      const minABI = abi;

      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);

      const contract = new ethers.Contract(srcToken.contract, minABI, signer);
      let value = Math.pow(10, srcToken.decimals);
      let srcAmount = amount * value;

      const tx = await contract.transfer(toAddress, String(srcAmount));

      if (!tx.hash) throw new Error(`Error tx hash.`);

      return tx.hash as string;
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  async previewSwap(
    fromCoin: string,
    toCoin: string,
    amount: number,
    blockchain: string,
    address: string
  ): Promise<any> {
    try {
      console.log("ETH ENTRO");
      const paraSwap = constructSimpleSDK({
        chainId: Number(process.env.PARASWAP_ETH),
        axios,
      });

      let fromToken: any = await UtilsShared.getTokenContract(
        fromCoin,
        blockchain
      );
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
        amount: String(srcAmount),
      });

      const response = await axios.get(
        "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6"
      );
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
      const feeGas = web3.utils.fromWei(
        String(Number(priceRoute.gasCost) * wei),
        "gwei"
      );

      const srcFee = String(Number(feeTransfer) + Number(feeGas));

      let feeDefix = String(Number(srcFee) * porcentFee);

      const dataSwap = {
        exchange: priceRoute.bestRoute[0].swaps[0].swapExchanges[0].exchange,
        fromAmount: priceRoute.srcAmount,
        fromDecimals: fromToken.decimals,
        toAmount: priceRoute.destAmount,
        toDecimals: toToken.decimals,
        fee: srcFee,
        feeDefix: feeDefix,
        feeTotal: String(Number(srcFee) + Number(feeDefix)),
      };

      return { dataSwap, priceRoute };
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }
}
