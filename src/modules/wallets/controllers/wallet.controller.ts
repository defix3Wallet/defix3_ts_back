import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service";
import Crypto from "../../../shared/crypto/crypto";

export class WalletController {
  private walletService: WalletService;

  constructor(walletService = new WalletService()) {
    this.walletService = walletService;
  }

  public createWallet = async (req: Request, res: Response) => {
    try {
      const { defixId, seedPhrase, email } = req.body;
      const mnemonic = Crypto.decrypt(seedPhrase);

      if (
        !defixId ||
        !defixId.includes(".defix3") ||
        defixId.includes(" ") ||
        !mnemonic
      )
        return res.status(400).send();

      const DefixId = defixId.toLowerCase();

      const exists: boolean = await validateDefixId(defixId.toLowerCase());

      if (!exists) {
        const credentials: Array<Credential> = [];

        credentials.push(await createWalletBTC(mnemonic));
        credentials.push(await createWalletETH(mnemonic));
        credentials.push(await createWalletNEAR(mnemonic));
        credentials.push(await createWalletTRON(mnemonic));
        credentials.push(await createWalletBNB(mnemonic));

        const wallet: Wallet = {
          defixId: DefixId,
          credentials: credentials,
        };

        const nearId = await getIdNear(mnemonic);

        const save = await saveUser(nearId, wallet);

        if (save) {
          if (await validateEmail(email)) {
            EnviarPhraseCorreo(mnemonic, DefixId, email);
            console.log("envia correo");
          }
          return res.send(wallet);
        }
        return res.status(400).send();
      } else {
        return res.status(405).send();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ err });
    }
  };
}
