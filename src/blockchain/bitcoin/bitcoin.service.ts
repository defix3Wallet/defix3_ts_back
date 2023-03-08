import ecfacory, {
  TinySecp256k1Interface,
  ECPairAPI,
  ECPairFactory,
} from "ecpair";
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

const tinysecp: TinySecp256k1Interface = require("tiny-secp256k1");
const ECPair: ECPairAPI = ECPairFactory(tinysecp);

const NETWORK = process.env.NETWORK;

export class BitcoinService implements BlockchainService {
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
  async fromPrivateKey(
    privateKey: string
  ): Promise<CredentialInterface | null> {
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
      const root: BIP32Interface = bip32.fromPrivateKey(
        keyPair.privateKey,
        chainCode
      );

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
    return await WAValidator.validate(address, "BTC");
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
}
