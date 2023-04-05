import axios from "axios";
import dbConnect from "../../config/postgres";
import { AddressEntity } from "../../modules/address/entities/address.entity";
import { Action, createTransaction } from "near-api-js/lib/transaction";
import {
  Account,
  ConnectedWalletAccount,
  Near,
  WalletConnection,
  utils,
} from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils";

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

  static async createTransaction(
    receiverId: string,
    actions: Action[],
    userAddress: string,
    near: Near
  ) {
    const walletConnection = new WalletConnection(near, null);
    const wallet = new ConnectedWalletAccount(
      walletConnection,
      near.connection,
      userAddress
    );

    if (!wallet || !near) {
      throw new Error(`No active wallet or NEAR connection.`);
    }

    const localKey = await near?.connection.signer.getPublicKey(
      userAddress,
      near.connection.networkId
    );

    const accessKey = await wallet.accessKeyForTransaction(
      receiverId,
      actions,
      localKey
    );

    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${receiverId}`
      );
    }

    const block = await near?.connection.provider.block({
      finality: "final",
    });

    if (!block) {
      throw new Error(
        `Cannot find block for transaction sent to ${receiverId}`
      );
    }

    const blockHash = utils.serialize.base_decode(block?.header?.hash);
    //const blockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);

    const publicKey = PublicKey.from(accessKey.public_key);
    //const nonce = accessKey.access_key.nonce + nonceOffset
    const nonce = ++accessKey.access_key.nonce;

    return createTransaction(
      userAddress,
      publicKey,
      receiverId,
      nonce,
      actions,
      blockHash
    );
  }
}
