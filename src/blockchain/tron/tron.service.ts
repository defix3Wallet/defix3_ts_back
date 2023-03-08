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
  async createWallet(mnemonic: string): Promise<CredentialInterface> {
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
}
