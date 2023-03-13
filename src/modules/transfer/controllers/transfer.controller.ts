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

  public sendTransfer = async (req: Request, res: Response) => {
    try {
      const { fromDefix, pkEncript, toDefix, coin, amount, blockchain } =
        req.body;
      if (
        !fromDefix ||
        !pkEncript ||
        !toDefix ||
        !coin ||
        !amount ||
        !blockchain
      )
        return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncript);

      if (!privateKey)
        return res.status(400).send({ message: "privateKey invalid." });

      const transaction = await this.transferService.sendTransfer(
        fromDefix,
        privateKey,
        toDefix,
        coin,
        amount,
        blockchain
      );

      this.mailService.sendMail(fromDefix, toDefix, "envio", {
        monto: amount,
        moneda: coin,
        receptor: toDefix,
        emisor: fromDefix,
        tipoEnvio: toDefix.includes(".defix3") ? "user" : "wallet",
      });
      res.send(transaction);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
