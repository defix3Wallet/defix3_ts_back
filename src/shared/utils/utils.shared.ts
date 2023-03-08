import { WalletEntity } from "../../modules/wallets/entities/wallet.entity";
const nearSEED = require("near-seed-phrase");

const NETWORK = process.env.NETWORK || "testnet";

export class UtilsShared {
  static getAddressUser = async (defixId: string, blockchain: string) => {
    try {
      const address = await WalletEntity.findOneBy({
        user: { defix_id: defixId },
        blockchain: blockchain,
      });

      if (!address) return false;

      return address.address;
    } catch (error) {
      return false;
    }
  };

  static validateEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  static getIdNear = async (mnemonic: string) => {
    const walletSeed = await nearSEED.parseSeedPhrase(mnemonic);
    const split = String(walletSeed.publicKey).split(":");
    const id = String(split[1]);
    return id;
  };

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
}
