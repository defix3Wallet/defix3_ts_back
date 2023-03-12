import dbConnect from "../../config/postgres";
import { AddressEntity } from "../../modules/address/entities/address.entity";

const nearSEED = require("near-seed-phrase");

const NETWORK = process.env.NETWORK || "testnet";

export class UtilsShared {
  static getTokenContract = async (token: string, blockchain: string) => {
    try {
      const conexion = await dbConnect();
      const response = await conexion.query(
        "SELECT *\
        FROM backend_token a\
        inner join backend_cryptocurrency b on b.id = a.cryptocurrency_id\
        where a.coin = $1 and b.coin = $2",
        [token, blockchain]
      );

      if (response.rows.length === 0)
        throw new Error(`Failed to get token contract.`);

      return response.rows[0];
    } catch (error) {
      throw new Error(`Failed to get token contract.`);
    }
  };

  static getAddressUser = async (defixId: string, blockchain: string) => {
    try {
      const address = await AddressEntity.findOneBy({
        user: { defixId: defixId },
        blockchain: blockchain,
      });

      if (!address) return false;

      return address.address;
    } catch (error) {
      return false;
    }
  };

  static getCryptos = async () => {
    try {
      const conexion = await dbConnect();
      const cryptocurrencys = await conexion.query(
        "select * from backend_cryptocurrency"
      );

      const cryptos = [];

      for (let cryptocurrency of cryptocurrencys.rows) {
        const tokens = await conexion.query(
          "select * from backend_token where cryptocurrency_id = $1",
          [cryptocurrency.id]
        );
        cryptocurrency.tokens = tokens.rows;
        cryptos.push(cryptocurrency);
      }

      return cryptos;
    } catch (error) {
      console.log(error);
      return [];
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
