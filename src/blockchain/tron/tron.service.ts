import { BlockchainService } from "../blockchain.interface";
import { CredentialInterface } from "../../interfaces/credential.interface";
const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;

const TRON_PRO_API_KEY = process.env.TRON_PRO_API_KEY;

const FULL_NODE = process.env.FULL_NODE;
const SOLIDITY_NODE = process.env.SOLIDITY_NODE;
const EVENT_SERVER = process.env.EVENT_SERVER;

const fullNode = new HttpProvider(FULL_NODE);
const solidityNode = new HttpProvider(SOLIDITY_NODE);
const eventServer = new HttpProvider(EVENT_SERVER);

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
tronWeb.setHeader({ "TRON-PRO-API-KEY": TRON_PRO_API_KEY });

export class TronService implements BlockchainService {
  async fromMnemonic(mnemonic: string): Promise<CredentialInterface> {
    const account = await tronWeb.fromMnemonic(mnemonic);
    let privateKey;

    if (account.privateKey.indexOf("0x") === 0) {
      privateKey = account.privateKey.slice(2);
    } else {
      privateKey = account.privateKey;
    }

    const credential: CredentialInterface = {
      name: "TRX",
      address: account.address,
      privateKey: privateKey,
    };

    return credential;
  }
  async fromPrivateKey(
    privateKey: string
  ): Promise<CredentialInterface | null> {
    try {
      const address = tronWeb.address.fromPrivateKey(privateKey);

      if (!address) return null;

      const credential: CredentialInterface = {
        name: "TRX",
        address: address,
        privateKey: privateKey,
      };

      return credential;
    } catch (error) {
      return null;
    }
  }
  async isAddress(address: string): Promise<boolean> {
    return await tronWeb.isAddress(address);
  }
  async getBalance(address: string): Promise<number> {
    try {
      let balanceTotal = 0;
      const balance = await tronWeb.trx.getBalance(address);
      if (balance) {
        let value = Math.pow(10, 6);
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
  async getBalanceToken(
    address: string,
    srcContract: string,
    decimals: number
  ): Promise<number> {
    try {
      tronWeb.setAddress(srcContract);
      const contract = await tronWeb.contract().at(srcContract);

      const balance = await contract.balanceOf(address).call();

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

      tronWeb.setAddress(fromAddress);

      let value = Math.pow(10, 6);
      let srcAmount = parseInt(String(amount * value));

      const tx = await tronWeb.transactionBuilder
        .sendTrx(toAddress, srcAmount)
        .then(function (response: any) {
          return response;
        })
        .catch(function (error: any) {
          return false;
        });

      if (!tx) throw new Error(`Error to do build transaction`);

      const signedTxn = await tronWeb.trx
        .sign(tx, privateKey)
        .then(function (response: any) {
          return response;
        })
        .catch(function (error: any) {
          return false;
        });

      if (!signedTxn.signature) {
        throw new Error(`Error to sign transaction`);
      }

      const result = await tronWeb.trx.sendRawTransaction(signedTxn);

      if (!result.txid) throw new Error(`Failed to send raw tx.`);

      return result.txid as string;
    } catch (err: any) {
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

      tronWeb.setAddress(fromAddress);

      let value = Math.pow(10, srcToken.decimals);
      let srcAmount = parseInt(String(amount * value));

      const contract = await tronWeb.contract().at(srcToken.contract);

      const transaction = await contract.transfer(toAddress, srcAmount).send({
        callValue: 0,
        shouldPollResponse: true,
        privateKey: privateKey,
      });

      console.log("TRANSACTION: ", transaction);

      return transaction;
    } catch (err: any) {
      throw new Error(`Failed to send transfer, ${err.message}`);
    }
  }

  previewSwap(
    fromCoin: string,
    toCoin: string,
    amount: number,
    blockchain: string,
    address: string
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
