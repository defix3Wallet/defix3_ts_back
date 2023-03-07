import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { UtilsShared } from "../../../shared/utils/utils.shared";
import { MailShared } from "../../../shared/email/email.shared";

export class WalletController {
  private walletService: WalletService;
  private mailService: MailShared;

  constructor() {
    this.walletService = new WalletService();
    this.mailService = new MailShared();
  }

  public createWalletDefix = async (req: Request, res: Response) => {
    try {
      const { defixId, seedPhrase, email } = req.body;
      if (!defixId || !seedPhrase)
        return res.status(400).send({ message: "Invalid data." });

      const mnemonic = CryptoShared.decrypt(seedPhrase);

      if (!mnemonic)
        return res.status(400).send({ message: "Seed Phrase invalid." });

      const defixID: string = defixId.toLowerCase();

      const wallet = await this.walletService.createWalletDefix(
        defixID,
        mnemonic
      );

      if (!wallet)
        return res.status(400).send({ message: "Internal server error." });

      if (await UtilsShared.validateEmail(email)) {
        this.mailService.sendMailPhrase(mnemonic, defixID, email);
      }
      return res.send(wallet);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error." });
    }
  };
}
