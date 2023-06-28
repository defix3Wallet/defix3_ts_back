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
      const { defixId, seedPhrase, email, language } = req.body;
      let lang = language;

      if (!defixId || !seedPhrase) return res.status(400).send({ message: "Invalid data." });

      const mnemonic = CryptoShared.decrypt(seedPhrase);

      if (!mnemonic) return res.status(400).send({ message: "Seed Phrase invalid." });

      if (lang !== "en" && lang !== "es") {
        lang = "en";
      }

      const defixID: string = defixId.toLowerCase();

      const wallet = await this.walletService.createWalletDefix(defixID, mnemonic, lang);

      if (!wallet) return res.status(400).send({ message: "Internal server error." });

      if (await UtilsShared.validateEmail(email)) {
        this.mailService.sendMailPhrase(mnemonic, defixID, email, lang);
      }
      return res.send(wallet);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public importWalletDefix = async (req: Request, res: Response) => {
    try {
      const { seedPhrase, language } = req.body;

      let lang = language;

      if (lang !== "en" && lang !== "es") {
        lang = "en";
      }

      if (!seedPhrase) return res.status(400).send({ message: "Invalid data." });

      const mnemonic = CryptoShared.decrypt(seedPhrase);

      if (!mnemonic) return res.status(400).send({ message: "Seed Phrase invalid." });

      const wallet = await this.walletService.importWalletDefix(mnemonic, lang);

      return res.send(wallet);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public importFromPrivateKey = async (req: Request, res: Response) => {
    try {
      const { pkEncrypt } = req.body;
      if (!pkEncrypt) return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "Invalid data." });

      const wallet = await this.walletService.importFromPrivateKey(privateKey);

      return res.send(wallet);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public validateAddress = async (req: Request, res: Response) => {
    try {
      const { address, blockchain } = req.body;
      if (!address || !blockchain) return res.status(400).send({ message: "Invalid data." });

      res.send(await this.walletService.validateAddress(address, blockchain));
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public importFromJson = async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).send({ message: "Invalid data." });

      const { ciphertext, typeLog, dateTime } = JSON.parse(data);
      if (!ciphertext || !typeLog || !dateTime) return res.status(400).send({ message: "Invalid variables." });

      const dataImport = {
        ciphertext,
        typeLog,
        dateTime,
      };

      const wallet = await this.walletService.importFromJson(dataImport);

      return res.send(wallet);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public exportWalletJson = async (req: Request, res: Response) => {
    try {
      const { ciphertext, typeLog } = req.body;
      const ciphertextMain = CryptoShared.decrypt(ciphertext);

      if (!ciphertextMain) return res.status(400).send({ message: "Invalid data." });

      if (!ciphertextMain && (typeLog !== "MNEMONIC" || typeLog !== "PRIVATE_KEY")) return res.status(400).send({ message: "Invalid data." });
      res.send(JSON.stringify(await this.walletService.exportWalletJson(ciphertextMain, typeLog)));
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
