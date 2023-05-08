import { Request, Response } from "express";
import { WithdrawService } from "../services/withdraw.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { MailShared } from "../../../shared/email/email.shared";

export class WithdrawController {
  private withdrawService: WithdrawService;
  private mailService: MailShared;

  constructor() {
    this.withdrawService = new WithdrawService();
    this.mailService = new MailShared();
  }

  public getFeeWithdraw = async (req: Request, res: Response) => {
    try {
      const { coin, blockchain, amount, address } = req.body;

      if (!coin || !blockchain) return res.status(400).send({ message: "Invalid data." });

      const previewData = await this.withdrawService.getFeeWithdraw(coin, blockchain, amount, address);
      res.send(previewData);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public sendWithdraw = async (req: Request, res: Response) => {
    try {
      const { defixId, pkEncrypt, toAddress, coin, amount, blockchain } = req.body;

      if (!defixId || !pkEncrypt || !toAddress || !coin || !amount || !blockchain) return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      const withdrawal = await this.withdrawService.sendWithdraw(defixId, privateKey, toAddress, coin, amount, blockchain);

      this.mailService.emailSuccessWithdrawal(defixId, toAddress, amount, coin, blockchain, withdrawal.hash);
      this.mailService.emailReceivedPayment(defixId, toAddress, amount, coin, blockchain, withdrawal.hash);

      res.send(withdrawal);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
