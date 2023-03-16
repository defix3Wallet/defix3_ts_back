import { UtilsShared } from "../../../shared/utils/utils.shared";
import { AddressService } from "../../address/services/address.service";
import { TransactionHistoryService } from "../../transactionHistory/services/transactionHistory.service";
import { blockchainService } from "../../../blockchain";

export class SwapService extends TransactionHistoryService {
  constructor() {
    super();
  }

  public getPreviewSwap = async (
    fromCoin: string,
    toCoin: string,
    amount: number,
    blockchain: string,
    address: string
  ) => {
    try {
      if (!Object.keys(blockchainService).includes(blockchain.toLowerCase())) {
        throw new Error(`Invalid blockchain.`);
      }

      const swapResult = await blockchainService[
        blockchain.toLowerCase() as keyof typeof blockchainService
      ].previewSwap(fromCoin, toCoin, amount, blockchain, address);

      if (!swapResult) {
        throw new Error(`Internal error swap preview.`);
      }

      return swapResult;
    } catch (err) {
      throw new Error(`Failed to get preview swap, ${err}`);
    }
  };
}
