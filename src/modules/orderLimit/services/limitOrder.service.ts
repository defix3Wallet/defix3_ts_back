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
}
