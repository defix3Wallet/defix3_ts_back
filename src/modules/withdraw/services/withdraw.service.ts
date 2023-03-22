import { UtilsShared } from "../../../shared/utils/utils.shared";
import { AddressService } from "../../address/services/address.service";
import { TransactionHistoryService } from "../../transactionHistory/services/transactionHistory.service";
import { blockchainService } from "../../../blockchain";
import { FrequentService } from "../../frequent/services/frequent.service";

export class WithdrawService extends TransactionHistoryService {
  private addressService: AddressService;
  private frequentService: FrequentService;

  constructor() {
    super();
    this.addressService = new AddressService();
    this.frequentService = new FrequentService();
  }

  public getFeeWithdraw = async (
    coin: string,
    blockchain: string,
    amount: number | undefined,
    address: string | undefined
  ) => {
    try {
      if (!Object.keys(blockchainService).includes(blockchain.toLowerCase())) {
        throw new Error(`Invalid blockchain.`);
      }

      const feeTransfer = await blockchainService[
        blockchain.toLowerCase() as keyof typeof blockchainService
      ].getFeeTransaction(coin, blockchain, "WITHDRAW", amount, address);

      if (!feeTransfer) {
        throw new Error(`Internal error fee preview.`);
      }

      return feeTransfer;
    } catch (err) {
      throw new Error(`Failed to get fee transfer, ${err}`);
    }
  };

  public sendWithdraw = async (
    fromDefix: string,
    privateKey: string,
    toAddress: string,
    coin: string,
    amount: number,
    blockchain: string
  ) => {
    try {
      let transactionHash: string | undefined, fromAddress;

      if (fromDefix.includes(".defix3")) {
        fromAddress = (
          await this.addressService.getAddressByDefixId(fromDefix, blockchain)
        )?.address;
      } else {
        fromAddress = fromDefix;
      }

      if (!fromAddress || !toAddress) throw new Error(`Invalid data.`);

      if (Object.keys(blockchainService).includes(coin.toLowerCase())) {
        transactionHash = await blockchainService[
          coin.toLowerCase() as keyof typeof blockchainService
        ].sendTransfer(fromAddress, privateKey, toAddress, amount, coin);
      } else {
        if (
          !Object.keys(blockchainService).includes(blockchain.toLowerCase())
        ) {
          throw new Error(`Invalid data.`);
        }
        const srcContract = await UtilsShared.getTokenContract(
          coin,
          blockchain
        );

        if (!srcContract) throw new Error(`Failed to get token contract.`);

        transactionHash = await blockchainService[
          blockchain.toLowerCase() as keyof typeof blockchainService
        ].sendTransferToken(
          fromAddress,
          privateKey,
          toAddress,
          amount,
          srcContract
        );
      }

      if (!transactionHash) throw new Error(`Transaction hash.`);

      const transaction = await this.createTransactionHistory({
        fromDefix,
        toDefix: toAddress,
        fromAddress,
        toAddress,
        blockchain,
        coin,
        amount,
        hash: transactionHash,
        typeTxn: "WITHDRAW",
      });

      await this.frequentService.createFrequent(
        fromDefix,
        toAddress,
        "WITHDRAW"
      );
      return transaction;
    } catch (err) {
      throw new Error(`Failed to send transfer, ${err}`);
    }
  };
}
