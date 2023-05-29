import { CredentialInterface } from "../interfaces/credential.interface";
export interface BlockchainService {
  fromMnemonic(mnemonic: string): Promise<CredentialInterface>;
  fromPrivateKey(privateKey: string): Promise<CredentialInterface | null>;
  isAddress(address: string): Promise<boolean>;
  getBalance(address: string): Promise<number>;
  getBalanceToken(address: string, contract: string, decimals: number): Promise<number>;
  getFeeTransaction(coin: string, blockchain: string, typeTxn: string, amount: number | undefined, address: string | undefined): Promise<any>;
  sendTransfer(fromAddress: string, privateKey: string, toAddress: string, amount: number, coin: string): Promise<string>;
  sendTransferToken(fromAddress: string, privateKey: string, toAddress: string, amount: number, srcToken: any): Promise<string>;
  previewSwap(fromCoin: string, toCoin: string, amount: number, blockchain: string, address: string | undefined): Promise<any>;
  sendSwap(priceRoute: any, privateKey: string, address: string): Promise<any>;
  sendLimitOrder(
    fromCoin: string,
    toCoin: string,
    srcAmount: number,
    destAmount: number,
    blockchain: string,
    address: string,
    privateKey: string
  ): Promise<any>;
  cancelLimitOrder(blockchain: string, address: string, privateKey: string): Promise<any>;
  getAllLimitOrder(address: string): Promise<any>;
  getOrderBookCoinToCoin(fromCoin: string, toCoin: string): Promise<any>;
}
