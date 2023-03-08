import { BlockchainService } from "../blockchain.interface";
import { ethers, Wallet } from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { CredentialInterface } from "../../interfaces/credential.interface";
import axios from "axios";
import { constructSimpleSDK, OptimalRate } from "@paraswap/sdk";

const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ETHERSCAN = process.env.ETHERSCAN;

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`
  )
);

export class EthereumService implements BlockchainService {
  async createWallet(mnemonic: string): Promise<CredentialInterface> {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    const credential: CredentialInterface = {
      name: "ETH",
      address: wallet.address,
      privateKey: wallet.privateKey,
    };

    return credential;
  }
  async getBalance(address: string): Promise<number> {
    try {
      let balance = await web3.eth.getBalance(address);

      let balanceTotal = 0;

      if (balance) {
        let value = Math.pow(10, 18);
        balanceTotal = Number(balance) / value;
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
