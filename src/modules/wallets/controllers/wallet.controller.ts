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

      // const mnemonic = seedPhrase;

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

  public importWalletDefix = async (req: Request, res: Response) => {
    try {
      const { seedPhrase } = req.body;
      if (!seedPhrase)
        return res.status(400).send({ message: "Invalid data." });

      const mnemonic = CryptoShared.decrypt(seedPhrase);

      // const mnemonic = seedPhrase;

      if (!mnemonic)
        return res.status(400).send({ message: "Seed Phrase invalid." });

      const wallet = await this.walletService.importWalletDefix(mnemonic);

      return res.send(wallet);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Internal server error.", error: err });
    }
  };

  public importFromPrivateKey = async (req: Request, res: Response) => {
    try {
      const { pkEncript } = req.body;
      if (!pkEncript) return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncript);
      // const privateKey = pkEncript;

      if (!privateKey)
        return res.status(400).send({ message: "Invalid data." });

      const wallet = await this.walletService.importFromPrivateKey(privateKey);

      return res.send(wallet);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Internal server error.", error: err });
    }
  };

  public validateAddress = async (req: Request, res: Response) => {
    try {
      const { address, blockchain } = req.body;
      if (!address || !blockchain)
        return res.status(400).send({ message: "Invalid data." });

      res.send(await this.walletService.validateAddress(address, blockchain));
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Internal server error.", error: err });
    }
  };
}
