import { Request, Response } from "express";
import { TransferService } from "../services/transfer.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { MailShared } from "../../../shared/email/email.shared";

export class TransferController {
  private transferService: TransferService;
  private mailService: MailShared;

  constructor() {
    this.transferService = new TransferService();
    this.mailService = new MailShared();
  }

  public getFeeTransfer = async (req: Request, res: Response) => {
    try {
      const { coin, blockchain, amount, address } = req.body;

      if (!coin || !blockchain) return res.status(400).send({ message: "Invalid data." });

      const previewData = await this.transferService.getFeeTransfer(coin, blockchain, amount, address);
      res.send(previewData);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public sendTransfer = async (req: Request, res: Response) => {
    try {
      const { defixId, pkEncrypt, toAddress, coin, amount, blockchain, language } = req.body;

      let lang = language;
      if (lang !== "en" && lang !== "es") {
        lang = "en";
      }

      if (!defixId || !pkEncrypt || !toAddress || !coin || !amount || !blockchain) return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      const transaction = await this.transferService.sendTransfer(defixId, privateKey, toAddress, coin, amount, blockchain);

      this.mailService.emailSuccessWithdrawal(defixId, toAddress, amount, coin, blockchain, transaction.hash, lang);
      this.mailService.emailReceivedPayment(defixId, toAddress, amount, coin, blockchain, transaction.hash, lang);

      res.send(transaction);
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).send({ message: error.message });
    }
  };
}
