import { BlockchainService } from "../blockchain.interface";
import {
  KeyPair,
  keyStores,
  Near,
  Account,
  utils,
  ConnectedWalletAccount,
  WalletConnection,
  Contract,
} from "near-api-js";
import axios from "axios";
const nearSEED = require("near-seed-phrase");
import { CredentialInterface } from "../../interfaces/credential.interface";
import { BufferN } from "bitcoinjs-lib/src/types";
import BN from "bn.js";
import ref from "@ref-finance/ref-sdk";
import {
  ftGetTokensMetadata,
  fetchAllPools,
  estimateSwap,
  instantSwap,
} from "@ref-finance/ref-sdk";
import {
  Action,
  createTransaction,
  functionCall,
} from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";
import e from "express";
import { NearUtils } from "./near.utils";
import { UtilsShared } from "../../shared/utils/utils.shared";

const NETWORK = process.env.NETWORK || "testnet";
const ETHERSCAN = process.env.ETHERSCAN;

let NEAR: string;

if (process.env.NEAR_ENV === "testnet") {
  NEAR = "testnet";
} else {
  NEAR = "near";
}

const dataToken = {
  decimals: 24,
  contract: "wrap.testnet",
};

export class NearService implements BlockchainService {
  async fromMnemonic(mnemonic: string): Promise<CredentialInterface> {
    const walletSeed = await nearSEED.parseSeedPhrase(mnemonic);
    const keyPair = KeyPair.fromString(walletSeed.secretKey);
    const implicitAccountId = Buffer.from(keyPair.getPublicKey().data).toString(
      "hex"
    );

    const credential: CredentialInterface = {
      name: "NEAR",
      address: implicitAccountId,
      privateKey: walletSeed.secretKey,
    };

    return credential;
  }
  async fromPrivateKey(
    privateKey: string
  ): Promise<CredentialInterface | null> {
    try {
      if (!privateKey.includes("ed25519:")) return null;
      const keyPair = KeyPair.fromString(privateKey);
      const implicitAccountId = Buffer.from(
        keyPair.getPublicKey().data
      ).toString("hex");

      const credential: CredentialInterface = {
        name: "NEAR",
        address: implicitAccountId,
        privateKey: privateKey,
      };

      return credential;
    } catch (error) {
      return null;
    }
  }
  async importWallet(
    nearId: string,
    mnemonic: string
  ): Promise<CredentialInterface> {
    const walletSeed = await nearSEED.parseSeedPhrase(mnemonic);
    const credential: CredentialInterface = {
      name: "NEAR",
      address: nearId,
      privateKey: walletSeed.secretKey,
    };

    return credential;
  }
  async isAddress(address: string): Promise<boolean> {
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = new Near(NearUtils.ConfigNEAR(keyStore));
    const account = new Account(near.connection, address);
    const is_address = await account
      .state()
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return is_address;
  }
  async getBalance(address: string): Promise<number> {
    try {
      let balanceTotal = 0;

      const keyStore = new keyStores.InMemoryKeyStore();
      const near = new Near(NearUtils.ConfigNEAR(keyStore));

      const account = new Account(near.connection, address);

      const balanceAccount = await account.state();
      const valueStorage = Math.pow(10, 19);
      const valueYocto = Math.pow(10, 24);
      const storage =
        (balanceAccount.storage_usage * valueStorage) / valueYocto;
      balanceTotal =
        Number(balanceAccount.amount) / valueYocto - storage - 0.05;
      if (balanceTotal === null || balanceTotal < 0) {
        balanceTotal = 0;
      }
      return balanceTotal;
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
      const keyStore = new keyStores.InMemoryKeyStore();
      const near = new Near(NearUtils.ConfigNEAR(keyStore));

      const account = new Account(near.connection, address);

      const balance = await account.viewFunction({
        contractId: srcContract,
        methodName: "ft_balance_of",
        args: { account_id: address },
      });

      if (!balance) return 0;

      return balance / Math.pow(10, decimals);
    } catch (error) {
      return 0;
    }
  }

  async getFeeTransaction(
    coin: string,
    blockchain: string,
    typeTxn: string
  ): Promise<any> {
    try {
      let comisionAdmin: any = await UtilsShared.getComision(coin);

      const feeMain = {
        coin,
        blockchain,
        fee: "",
      };

      let comision;

      if (typeTxn === "TRANSFER") {
        comision = comisionAdmin.transfer;
      } else if (typeTxn === "WITHDRAW") {
        comision = comisionAdmin.withdraw;
      }

      if (!comision) {
        feeMain.fee = "0";
      } else {
        feeMain.fee = "0";
      }
      return feeMain;
    } catch (err: any) {
      throw new Error(`Failed to get fee transfer, ${err.message}`);
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

      if (balance < amount)
        throw new Error(
          `Error: You do not have enough funds to make the transfer`
        );

      const keyStore = new keyStores.InMemoryKeyStore();

      const keyPair = KeyPair.fromString(privateKey);
      keyStore.setKey(NETWORK, fromAddress, keyPair);

      const near = new Near(NearUtils.ConfigNEAR(keyStore));

      const account = new Account(near.connection, fromAddress);

      const amountInYocto = utils.format.parseNearAmount(String(amount));

      if (!amountInYocto) throw new Error(`Failed to send transfer.`);

      const response = await account.sendMoney(
        toAddress,
        new BN(amountInYocto)
      );

      if (!response.transaction.hash)
        throw new Error(`Failed to send transfer.`);

      return response.transaction.hash as string;
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  sendTransferToken(
    fromAddress: string,
    privateKey: string,
    toAddress: string,
    amount: number,
    srcToken: any
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async previewSwap(
    fromCoin: string,
    toCoin: string,
    amount: number,
    blockchain: string,
    address: string
  ): Promise<any> {
    try {
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

      const tokenIn = fromToken.contract;
      const tokenOut = toToken.contract;

      const tokensMetadata = await ftGetTokensMetadata([tokenIn, tokenOut]);

      const simplePools = (await fetchAllPools()).simplePools.filter((pool) => {
        return pool.tokenIds[0] === tokenIn && pool.tokenIds[1] === tokenOut;
      });

      const swapAlls = await estimateSwap({
        tokenIn: tokensMetadata[tokenIn],
        tokenOut: tokensMetadata[tokenOut],
        amountIn: String(amount),
        simplePools: simplePools,
        options: { enableSmartRouting: true },
      });

      const transactionsRef = await instantSwap({
        tokenIn: tokensMetadata[tokenIn],
        tokenOut: tokensMetadata[tokenOut],
        amountIn: String(amount),
        swapTodos: swapAlls,
        slippageTolerance: 0.01,
        AccountId: address,
      });

      const transaction = transactionsRef.find(
        (element) => element.functionCalls[0].methodName === "ft_transfer_call"
      );

      if (!transaction) return false;

      const transfer: any = transaction.functionCalls[0].args;
      const data = JSON.parse(transfer.msg);

      const comision = await UtilsShared.getComision(blockchain);

      const nearPrice = await axios.get("https://nearblocks.io/api/near-price");

      let feeTransfer = "0";
      let porcentFee = 0;

      if (comision.swap) {
        porcentFee = comision.swap / 100;
      }

      let feeDefix = String(Number(amount) * porcentFee);

      const firstNum =
        Number(data.actions[0].amount_in) /
        Math.pow(10, Number(tokensMetadata[tokenIn].decimals));
      const secondNum =
        Number(data.actions[0].min_amount_out) /
        Math.pow(10, Number(tokensMetadata[tokenOut].decimals));

      const swapRate = String(secondNum / firstNum);

      const dataSwap = {
        exchange: "Ref Finance" + data.actions[0].pool_id,
        fromAmount: data.actions[0].amount_in,
        fromDecimals: tokensMetadata[tokenIn].decimals,
        toAmount: data.actions[0].min_amount_out,
        toDecimals: tokensMetadata[tokenOut].decimals,
        block: null,
        swapRate,
        contract: tokenIn,
        fee: String(porcentFee),
        feeDefix: feeDefix,
        feeTotal: String(Number(feeDefix)),
      };

      return { dataSwap, priceRoute: transactionsRef };
    } catch (error: any) {
      throw new Error(`Feiled to get preview swap., ${error.message}`);
    }
  }

  async sendSwap(
    priceRoute: any,
    privateKey: string,
    address: string
  ): Promise<any> {
    try {
      const transaction = priceRoute.find(
        (element: any) =>
          element.functionCalls[0].methodName === "ft_transfer_call"
      );

      if (!transaction) throw new Error(`Failed to create tx.`);

      const transfer: any = transaction.functionCalls[0].args;
      const data = JSON.parse(transfer.msg);

      const tokensMetadata = await ftGetTokensMetadata([
        data.actions[0].token_in,
        data.actions[0].token_out,
      ]);

      const tokenIn = tokensMetadata[data.actions[0].token_in];
      const tokenOut = tokensMetadata[data.actions[0].token_out];

      const keyStore = new keyStores.InMemoryKeyStore();

      const keyPair = KeyPair.fromString(privateKey);
      keyStore.setKey(process.env.NEAR_ENV!, address, keyPair);
      const near = new Near(NearUtils.ConfigNEAR(keyStore));

      const account = new Account(near.connection, address);

      let nearTransactions = [];

      if (data.actions[0].token_in.includes("wrap.")) {
        const trx = await NearUtils.createTransaction(
          data.actions[0].token_in,
          [
            await functionCall(
              "near_deposit",
              {},
              new BN("300000000000000"),
              new BN(data.actions[0].amount_in)
            ),
          ],
          address,
          near
        );

        nearTransactions.push(trx);
      }

      const trxs = await Promise.all(
        priceRoute.map(async (tx: any) => {
          return await NearUtils.createTransaction(
            tx.receiverId,
            tx.functionCalls.map((fc: any) => {
              return functionCall(
                fc.methodName,
                fc.args,
                fc.gas,
                new BN(String(utils.format.parseNearAmount(fc.amount)))
              );
            }),
            address,
            near
          );
        })
      );

      nearTransactions = nearTransactions.concat(trxs);

      if (data.actions[0].token_out.includes("wrap.")) {
        const trx = await NearUtils.createTransaction(
          data.actions[0].token_out,
          [
            await functionCall(
              "near_withdraw",
              { amount: data.actions[0].min_amount_out },
              new BN("300000000000000"),
              new BN("1")
            ),
          ],
          address,
          near
        );

        nearTransactions.push(trx);
      }

      let resultSwap: any;
      for (let trx of nearTransactions) {
        const result = await account.signAndSendTransaction(trx);

        if (trx.actions[0].functionCall.methodName === "ft_transfer_call") {
          resultSwap = result;
        }
      }

      if (!resultSwap.transaction.hash) return false;

      const transactionHash = resultSwap.transaction.hash;
      const block = resultSwap.transaction_outcome.block_hash;

      if (!transactionHash) return false;

      const srcAmount = String(
        Number(data.actions[0].amount_in) / Math.pow(10, tokenIn.decimals)
      );
      const destAmount = String(
        Number(data.actions[0].min_amount_out) / Math.pow(10, tokenOut.decimals)
      );

      return {
        transactionHash,
        srcAmount,
        destAmount,
        block,
      };
    } catch (err: any) {
      throw new Error(`Failed to send swap, ${err.message}`);
    }
  }
}
