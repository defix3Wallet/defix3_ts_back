import { TransactionHistoryService } from "../../transactionHistory/services/transactionHistory.service";
import { blockchainService } from "../../../blockchain";

export class LimitOrderService extends TransactionHistoryService {
  constructor() {
    super();
  }

  public sendLimitOrder = async (
    fromCoin: string,
    toCoin: string,
    srcAmount: number,
    destAmount: number,
    blockchain: string,
    address: string,
    privateKey: string
  ) => {
    try {
      if (blockchain !== "ETH") {
        throw new Error(`Invalid blockchain.`);
      }

      address = "0x2296A703c339a8B876106B7F4CA57FAf6aD183b5";
      privateKey = "0b997b0b885825cf21cd5a8abfd457d2e865878f423209c7a5bb326a35012cd8";

      const orderResult = await blockchainService[blockchain.toLowerCase() as keyof typeof blockchainService].sendLimitOrder(
        fromCoin,
        toCoin,
        srcAmount,
        destAmount,
        blockchain,
        address,
        privateKey
      );

      if (!orderResult) {
        throw new Error(`Internal error swap preview.`);
      }

      return orderResult;
    } catch (error: any) {
      throw new Error(`Failed to send order limit, ${error.message}`);
    }
  };

  public cancelAllLimitOrder = async (blockchain: string, address: string, privateKey: string) => {
    try {
      if (blockchain !== "ETH") {
        throw new Error(`Invalid blockchain.`);
      }

      address = "";
      privateKey = "";

      const orderResult = await blockchainService[blockchain.toLowerCase() as keyof typeof blockchainService].cancelAllLimitOrder(
        address,
        privateKey
      );

      if (!orderResult) {
        throw new Error(`Internal error swap preview.`);
      }

      return orderResult;
    } catch (error: any) {
      throw new Error(`Failed to send order limit, ${error.message}`);
    }
  };
}
