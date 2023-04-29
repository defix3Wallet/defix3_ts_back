import axios from "axios";
import dbConnect from "../../config/postgres";
import { AddressEntity } from "../../modules/address/entities/address.entity";
import { Action, createTransaction } from "near-api-js/lib/transaction";
import { Account, ConnectedWalletAccount, Contract, Near, WalletConnection, utils } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils";
import { DCLSwap, Pool, StablePool, SwapOptions, estimateSwap, fetchAllPools, getDCLPoolId, getStablePools, instantSwap } from "@ref-finance/ref-sdk";

const nearSEED = require("near-seed-phrase");

const NETWORK = process.env.NETWORK || "testnet";

export class AccountService extends Account {
  public async signAndSendTrx(trx: any) {
    return await this.signAndSendTransaction(trx);
  }
}

export class NearUtils {
  static ConfigNEAR(keyStores: any) {
    switch (NETWORK) {
      case "mainnet":
        return {
          networkId: "mainnet",
          nodeUrl: "https://rpc.mainnet.near.org",
          keyStore: keyStores,
          walletUrl: "https://wallet.near.org",
          helperUrl: "https://helper.mainnet.near.org",
          explorerUrl: "https://explorer.mainnet.near.org",
        };
      case "testnet":
        return {
          networkId: "testnet",
          keyStore: keyStores,
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
      default:
        throw new Error(`Unconfigured environment '${NETWORK}'`);
    }
  }

  static async createTransaction(receiverId: string, actions: Action[], userAddress: string, near: Near) {
    const walletConnection = new WalletConnection(near, null);
    const wallet = new ConnectedWalletAccount(walletConnection, near.connection, userAddress);

    if (!wallet || !near) {
      throw new Error(`No active wallet or NEAR connection.`);
    }

    const localKey = await near?.connection.signer.getPublicKey(userAddress, near.connection.networkId);

    const accessKey = await wallet.accessKeyForTransaction(receiverId, actions, localKey);

    if (!accessKey) {
      throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
    }

    const block = await near?.connection.provider.block({
      finality: "final",
    });

    if (!block) {
      throw new Error(`Cannot find block for transaction sent to ${receiverId}`);
    }

    const blockHash = utils.serialize.base_decode(block?.header?.hash);
    //const blockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);

    const publicKey = PublicKey.from(accessKey.public_key);
    //const nonce = accessKey.access_key.nonce + nonceOffset
    const nonce = ++accessKey.access_key.nonce;

    return createTransaction(userAddress, publicKey, receiverId, nonce, actions, blockHash);
  }

  static async getTxSwapRef(tokenMetadataA: any, tokenMetadataB: any, amount: number, address: string) {
    const { ratedPools, unRatedPools, simplePools } = await fetchAllPools();

    const stablePools: Pool[] = unRatedPools.concat(ratedPools);

    const stablePoolsDetail: StablePool[] = await getStablePools(stablePools);

    const options: SwapOptions = {
      enableSmartRouting: true,
      stablePools,
      stablePoolsDetail,
    };

    const swapAlls = await estimateSwap({
      tokenIn: tokenMetadataA,
      tokenOut: tokenMetadataB,
      amountIn: String(amount),
      simplePools: simplePools,
      options,
    });

    const transactionsRef = await instantSwap({
      tokenIn: tokenMetadataA,
      tokenOut: tokenMetadataB,
      amountIn: String(amount),
      swapTodos: swapAlls,
      slippageTolerance: 0.01,
      AccountId: address,
    });

    return transactionsRef;
  }

  static async getTxSwapDCL(tokenMetadataA: any, tokenMetadataB: any, amount: number) {
    const nearUsd = await getNearPrice();

    const fee = 2000;

    const pool_ids = [getDCLPoolId(tokenMetadataA.id, tokenMetadataB.id, fee)];

    const transactionsDcl = await DCLSwap({
      swapInfo: {
        amountA: String(amount),
        tokenA: tokenMetadataA,
        tokenB: tokenMetadataB,
      },
      Swap: {
        pool_ids,
        min_output_amount: String(Math.round(amount * nearUsd * 0.99 * Math.pow(10, tokenMetadataB.decimals))),
      },
      AccountId: tokenMetadataA.id,
    });

    return transactionsDcl;
  }

  static getMinAmountOut(trxSwap: any, tokenOut: string) {
    const transaction = trxSwap.find(
      (element: {
        functionCalls: {
          methodName: string;
        }[];
      }) => element.functionCalls[0].methodName === "ft_transfer_call"
    );

    if (!transaction) return false;

    console.log("TXXX");

    const argsMsg = JSON.parse(transaction.functionCalls[0].args.msg);

    console.log(argsMsg);

    if (Object.keys(argsMsg).includes("actions")) {
      let minAmountOut = 0;
      for (const action of argsMsg.actions) {
        if (action.token_out === tokenOut) {
          minAmountOut += Number(action.min_amount_out);
        }
      }
      return minAmountOut;
    } else if (Object.keys(argsMsg).includes("Swap")) {
      return Number(argsMsg.Swap.min_output_amount);
    } else {
      return 0;
    }
  }
}
async function getNearPrice() {
  try {
    const nearPrice: any = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=NEAR&vs_currencies=USD");

    if (!nearPrice.data.near.usd) throw new Error("Error near usd");
    return nearPrice.data.near.usd;
  } catch (error) {
    const nearPrice = await axios.get("https://nearblocks.io/api/near-price");
    if (!nearPrice.data.usd) throw new Error("Error near usd");
    return nearPrice.data.usd;
  }
}
