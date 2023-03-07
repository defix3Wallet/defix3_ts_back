import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";

export class WalletController {
  private walletService: WalletService;

  constructor(walletService = new WalletService()) {
    this.walletService = walletService;
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

      // if (await validateEmail(email)) {
      //   EnviarPhraseCorreo(mnemonic, defixID, email);
      //   console.log("envia correo");
      // }
      return res.send(wallet);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error." });
    }
  };
}
