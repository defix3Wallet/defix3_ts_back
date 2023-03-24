import axios from "axios";
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

      if (response.rows.length === 0) return false;

      return response.rows[0];
    } catch (error) {
      throw new Error(`Failed to get token contract.`);
    }
  };

  static getComision = async (coin: string) => {
    try {
      const url = process.env.URL_DJANGO + "api/v1/get-comision/" + coin;
      const result = axios
        .get(url)
        .then(function (response) {
          return response.data;
        })
        .catch(function (err) {
          throw new Error(`Failed to get comision api. ${err.message}}`);
        });
      return result;
    } catch (error: any) {
      throw new Error(`Failed to get comision fn. ${error.message}`);
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

  static getAddressVault = (coin: string) => {
    switch (coin) {
      case "BTC":
        return process.env.VAULT_BTC;
      case "NEAR":
        return process.env.VAULT_NEAR;
      case "ETH":
        return process.env.VAULT_ETH;
      case "TRX":
        return process.env.VAULT_TRON;
      case "BNB":
        return process.env.VAULT_BNB;
      default:
        throw new Error(`Unconfigured environment '${coin}'`);
    }
  };

  static getLinkTransaction = (blockchain: string, transactionHash: string) => {
    switch (blockchain) {
      case "BTC":
        if (process.env.NETWORK === "mainnet") {
          return `https://live.blockcypher.com/btc/tx/${transactionHash}`;
        } else {
          return `https://live.blockcypher.com/btc-testnet/tx/${transactionHash}`;
        }
      case "NEAR":
        if (process.env.NETWORK === "mainnet") {
          return `https://explorer.near.org/transactions/${transactionHash}`;
        } else {
          return `https://explorer.testnet.near.org/transactions/${transactionHash}`;
        }
      case "ETH":
        if (process.env.NETWORK === "mainnet") {
          return `https://etherscan.io/tx/${transactionHash}`;
        } else {
          return `https://${process.env.ETHERSCAN}.etherscan.io/tx/${transactionHash}`;
        }
      case "TRX":
        if (process.env.NETWORK === "mainnet") {
          return `https://tronscan.org/#/transaction/${transactionHash}`;
        } else {
          return `https://shasta.tronscan.org/#/transaction/${transactionHash}`;
        }
      case "BNB":
        if (process.env.NETWORK === "mainnet") {
          return `https://bscscan.com/tx/${transactionHash}`;
        } else {
          return `https://testnet.bscscan.com/tx/${transactionHash}`;
        }
      default:
        throw new Error(`Error blockchain '${blockchain}'`);
    }
  };
}
