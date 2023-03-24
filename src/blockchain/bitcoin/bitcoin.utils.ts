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
import { UtilsShared } from "../../shared/utils/utils.shared";

const tinysecp: TinySecp256k1Interface = require("tiny-secp256k1");
const ECPair: ECPairAPI = ECPairFactory(tinysecp);

const NETWORK = process.env.NETWORK;

export class BitcoinUtils {
  static async newTxFee(comisionAdmin: any, amount: number, address: string) {
    try {
      const vault_address = await UtilsShared.getAddressVault("BTC");

      const comision = comisionAdmin / 100;

      var for_vault = amount * comision;

      const value_satoshi = 100000000;
      const amountSatoshi = amount * value_satoshi;
      const vaultSatoshi = parseInt(String(for_vault * value_satoshi));

      const data = {
        inputs: [
          {
            addresses: [address],
          },
        ],
        outputs: [
          {
            addresses: [address],
            value: parseInt(String(amountSatoshi)),
          },
        ],
      };

      if (vaultSatoshi !== 0 && vault_address) {
        data.outputs.push({
          addresses: [vault_address],
          value: parseInt(String(vaultSatoshi)),
        });
      }
      const config = {
        method: "post",
        url:
          "https://api.blockcypher.com/v1/btc/" +
          process.env.BLOCKCYPHER +
          "/txs/new",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const fee = await axios(config)
        .then(async function (tmptx) {
          let inputs = tmptx.data.tx.inputs.length;
          let outputs = tmptx.data.tx.outputs.length;
          let bytes = inputs * 146 + outputs * 33 + 16;
          let resp = await axios
            .get("https://bitcoinfees.earn.com/api/v1/fees/recommended")
            .then(async function (response) {
              let price = response.data.hourFee;

              let fee = (bytes * price) / 100000000;

              return fee;
            })
            .catch(function (error) {
              throw new Error(`Error bitcoin tx'`);
            });

          return resp;
        })
        .catch(async function (error) {
          let inputs = error.response.data.tx.inputs.length;
          let outputs = error.response.data.tx.outputs.length;
          let bytes = inputs * 146 + outputs * 33 + 16;
          let resp = await axios
            .get("https://bitcoinfees.earn.com/api/v1/fees/recommended")
            .then(async function (response) {
              let price = response.data.hourFee;

              let fee = (bytes * price) / 100000000;

              return fee;
            })
            .catch(function (error) {
              throw new Error(`Error bitcoin tx'`);
            });

          return resp;
        });
      return fee;
    } catch (error: any) {
      throw new Error(`Error bitcoin tx ${error.message}`);
    }
  }
}
