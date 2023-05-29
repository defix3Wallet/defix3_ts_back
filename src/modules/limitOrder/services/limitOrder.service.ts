import { TransactionHistoryService } from "../../transactionHistory/services/transactionHistory.service";
import { blockchainService } from "../../../blockchain";
import { UtilsShared } from "../../../shared/utils/utils.shared";
import axios from "axios";

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
        throw new Error(`Internal error send limit order.`);
      }

      return orderResult;
    } catch (error: any) {
      throw new Error(`Failed to send order limit, ${error.message}`);
    }
  };

  public cancelLimitOrder = async (blockchain: string, orderHash: string, privateKey: string) => {
    try {
      if (blockchain !== "ETH") {
        throw new Error(`Invalid blockchain.`);
      }

      const orderResult = await blockchainService[blockchain.toLowerCase() as keyof typeof blockchainService].cancelLimitOrder(orderHash, privateKey);

      if (!orderResult) {
        throw new Error(`Internal error swap preview.`);
      }

      return orderResult;
    } catch (error: any) {
      throw new Error(`Failed to send order limit, ${error.message}`);
    }
  };

  public getAllLimitOrder = async (blockchain: string, address: string) => {
    try {
      if (blockchain !== "ETH") {
        throw new Error(`Invalid blockchain.`);
      }

      const ordersResult = await blockchainService[blockchain.toLowerCase() as keyof typeof blockchainService].getAllLimitOrder(address);

      if (!ordersResult) {
        throw new Error(`Internal error swap preview.`);
      }

      return ordersResult;
    } catch (error: any) {
      throw new Error(`Failed to get all order limit, ${error.message}`);
    }
  };

  public getOrderBook = async (blockchain: string, fromToken: string, toToken: string) => {
    try {
      console.log(fromToken, toToken);
      fromToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      toToken = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      const orders = await axios.get("https://api.paraswap.io/ft/orders/1/orderbook/?makerAsset=" + fromToken + "&takerAsset=" + toToken);
      console.log(orders.data);
      return orders.data.orders;
    } catch (error: any) {
      throw new Error(`Failed to get order book, ${error.message}`);
    }
  };
}
