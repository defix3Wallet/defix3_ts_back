import { UtilsShared } from "../../../shared/utils/utils.shared";
import { AddressService } from "../../address/services/address.service";
import { TransactionHistoryService } from "../../transactionHistory/services/transactionHistory.service";
import { blockchainService } from "../../../blockchain";
import { TransactionHistoryEntity } from "../../transactionHistory/entities/transactionHistory.entity";
import { FrequentService } from "../../frequent/services/frequent.service";

export class TransferService extends TransactionHistoryService {
  private addressService: AddressService;
  private frequentService: FrequentService;

  constructor() {
    super();
    this.addressService = new AddressService();
    this.frequentService = new FrequentService();
  }

  public sendTransfer = async (
    fromDefix: string,
    privateKey: string,
    toDefix: string,
    coin: string,
    amount: number,
    blockchain: string
  ) => {
    try {
      let transactionHash: string | undefined,
        fromAddress,
        toAddress,
        tipoEnvio;

      if (fromDefix.includes(".defix3")) {
        fromAddress = (
          await this.addressService.getAddressByDefixId(fromDefix, blockchain)
        )?.address;
      } else {
        fromAddress = fromDefix;
      }

      if (toDefix.includes(".defix3")) {
        toAddress = (
          await this.addressService.getAddressByDefixId(toDefix, blockchain)
        )?.address;
        tipoEnvio = "user";
      } else {
        toAddress = toDefix;
        tipoEnvio = "wallet";
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
        toDefix,
        fromAddress,
        toAddress,
        blockchain,
        coin,
        amount,
        hash: transactionHash,
        typeTxn: "TRANSFER",
      });

      await this.frequentService.createFrequent(fromDefix, toDefix);
      return transaction;
      // const resSend = await getEmailFlagFN(fromDefix, "SEND");
      // const resReceive = await getEmailFlagFN(toDefix, "RECEIVE");
      // const item = {
      //   monto: amount,
      //   moneda: coin,
      //   receptor: toDefix,
      //   emisor: fromDefix,
      //   tipoEnvio: tipoEnvio,
      // };
      // EnvioCorreo(resSend, resReceive, "envio", item);
    } catch (err) {
      throw new Error(`Failed to send transfer, ${err}`);
    }
  };
}
