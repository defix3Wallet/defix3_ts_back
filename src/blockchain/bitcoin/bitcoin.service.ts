import ecfacory, { TinySecp256k1Interface, ECPairAPI, ECPairFactory } from "ecpair";
import { networks, payments, script } from "bitcoinjs-lib";
import { mnemonicToSeedSync } from "bip39";
const WAValidator = require("wallet-address-validator");
import axios from "axios";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import { BIP32Interface } from "bip32";
const bip32 = BIP32Factory(ecc);
import crypto from "crypto";
import { CredentialInterface } from "../../interfaces/credential.interface";
import { BlockchainService } from "../blockchain.interface";
import { UtilsShared } from "../../shared/utils/utils.shared";
import { BitcoinUtils } from "./bitcoin.utils";

const tinysecp: TinySecp256k1Interface = require("tiny-secp256k1");
const ECPair: ECPairAPI = ECPairFactory(tinysecp);

const NETWORK = process.env.NETWORK;

export class BitcoinService implements BlockchainService {
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
    let network;
    let path;
    if (NETWORK === "mainnet") {
      network = networks.bitcoin; //use networks.testnet networks.bitcoin for testnet
      path = `m/49'/0'/0'/0`; // Use m/49'/1'/0'/0 for testnet mainnet `m/49'/0'/0'/0
    } else {
      network = networks.testnet;
      path = `m/49'/1/0'/0`;
    }

    const seed = mnemonicToSeedSync(mnemonic);

    const root: BIP32Interface = bip32.fromSeed(seed, network);

    const account = root.derivePath(path);

    const node = account.derive(0).derive(0);

    const btcAddress = payments.p2pkh({
      pubkey: node.publicKey,
      network: network,
    }).address;

    const credential: CredentialInterface = {
      name: "BTC",
      address: btcAddress || "",
      privateKey: node.toWIF(),
    };

    return credential;
  }
  async fromPrivateKey(privateKey: string): Promise<CredentialInterface | null> {
    try {
      let network;
      let path;
      if (NETWORK === "mainnet") {
        network = networks.bitcoin; //use networks.testnet networks.bitcoin for testnet
        path = `m/49'/0'/0'/0`; // Use m/49'/1'/0'/0 for testnet mainnet `m/49'/0'/0'/0
      } else {
        network = networks.testnet; //use networks.testnet networks.bitcoin for testnet;
        path = `m/49'/1/0'/0`;
      }

      const keyPair = ECPair.fromWIF(privateKey, network);
      if (!keyPair.privateKey) return null;

      const chainCode = Buffer.alloc(32);
      const root: BIP32Interface = bip32.fromPrivateKey(keyPair.privateKey, chainCode);

      const { address } = payments.p2pkh({
        pubkey: root.publicKey,
        network: network,
      });

      if (!address) return null;

      const credential: CredentialInterface = {
        name: "BTC",
        address: address,
        privateKey: keyPair.toWIF(),
      };

      return credential;
    } catch (error) {
      return null;
    }
  }
  async isAddress(address: string): Promise<boolean> {
    if (NETWORK === "mainnet") {
      return await WAValidator.validate(address, "BTC");
    } else {
      return await WAValidator.validate(address, "BTC", "testnet");
    }
  }
  async getBalance(address: string): Promise<number> {
    try {
      const method = "get";
      const url = "https://blockchain.info/q/addressbalance/" + address;

      const balance = await axios[method](url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.data || response.data === 0) {
            const satoshi = response.data;
            const value_satoshi = 100000000;
            const balance = satoshi / value_satoshi || 0;
            return balance;
          }
          const item = await this.getBalanceBTC_Cypher(address);
          return item;
        })
        .catch(async (error) => {
          const item = await this.getBalanceBTC_Cypher(address);
          return item;
        });
      return balance;
    } catch (error) {
      console.error(error);
      const item = await this.getBalanceBTC_Cypher(address);
      return item;
    }
  }
  async getBalanceToken(address: string, contract: string, decimals: number): Promise<number> {
    return 0;
  }
  private getBalanceBTC_Cypher = async (address: string) => {
    try {
      const method = "get";
      const url =
        "https://api.blockcypher.com/v1/btc/" +
        process.env.BLOCKCYPHER +
        "/addrs/" +
        address +
        "/balance?token=" +
        "efe763283ba84fef88d23412be0c5970";

      const balance = await axios[method](url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.data) {
            const satoshi = response.data.balance;
            const value_satoshi = 100000000;
            return satoshi / value_satoshi || 0;
          }
          return 0;
        })
        .catch((error) => {
          return 0;
        });
      return balance;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  async getFeeTransaction(coin: string, blockchain: string, typeTxn: string, amount: number | undefined, address: string | undefined): Promise<any> {
    try {
      if (!amount || !address) throw new Error(`Failed to amount tx btc`);
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

      feeMain.fee = String(await BitcoinUtils.newTxFee(comision, amount, address));
      return feeMain;
    } catch (err: any) {
      throw new Error(`Failed to get fee transaction, ${err.message}`);
    }
  }

  async sendTransfer(fromAddress: string, privateKey: string, toAddress: string, amount: number, coin: string): Promise<string> {
    try {
      let network;
      if (NETWORK === "mainnet") {
        network = networks.bitcoin; //use networks.testnet networks.bitcoin for testnet
      } else {
        network = networks.testnet; //use networks.testnet networks.bitcoin for testnet
      }

      const keys = ECPair.fromWIF(privateKey, network);

      const value_satoshi = 100000000;
      const amountSatoshi = amount * value_satoshi;
      const vaultSatoshi = 0; // parseInt(String(for_vault * value_satoshi));

      const data = {
        inputs: [
          {
            addresses: [fromAddress],
          },
        ],
        outputs: [
          {
            addresses: [toAddress],
            value: parseInt(String(amountSatoshi)),
          },
        ],
      };

      if (vaultSatoshi !== 0) {
        data.outputs.push({
          addresses: [fromAddress],
          value: parseInt(String(vaultSatoshi)),
        });
      }

      const config = {
        method: "post",
        url: "https://api.blockcypher.com/v1/btc/" + process.env.BLOCKCYPHER + "/txs/new",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      let txHash = null;

      await axios(config)
        .then(async function (tmptx) {
          tmptx.data.pubkeys = [];
          tmptx.data.signatures = tmptx.data.tosign.map(function (tosign: any, n: any) {
            tmptx.data.pubkeys.push(keys.publicKey.toString("hex"));
            return script.signature
              .encode(keys.sign(Buffer.from(tosign, "hex")), 0x01)
              .toString("hex")
              .slice(0, -2);
          });

          const result = axios
            .post("https://api.blockcypher.com/v1/btc/" + process.env.BLOCKCYPHER + "/txs/send", tmptx.data)
            .then(function (finaltx) {
              txHash = finaltx.data.tx.hash;
              console.log("hash", finaltx.data.tx.hash);
              return true;
            })
            .catch(function (err: any) {
              throw new Error(`Failed to axios, ${err.message}`);
            });
          return result;
        })
        .catch(function (err: any) {
          throw new Error(`Failed to axios, ${err.message}`);
        });

      if (!txHash) throw new Error(`Failed to send btc, hash.`);

      return txHash as string;
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }
  sendTransferToken(fromAddress: string, privateKey: string, toAddress: string, amount: number, srcToken: any): Promise<string> {
    throw new Error("Method not implemented.");
  }

  previewSwap(fromCoin: string, toCoin: string, amount: number, blockchain: string, address: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  sendSwap(priceRoute: any, privateKey: string, address: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  cancelLimitOrder(address: string, privateKey: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAllLimitOrder(address: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
