import { Request, Response } from "express";
import { SwapService } from "../services/swap.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { MailShared } from "../../../shared/email/email.shared";
import { UtilsShared } from "../../../shared/utils/utils.shared";

export class SwapController {
  private swapService: SwapService;
  private mailService: MailShared;

  constructor() {
    this.swapService = new SwapService();
    this.mailService = new MailShared();
  }

  public getPreviewSwap = async (req: Request, res: Response) => {
    try {
      const { fromCoin, toCoin, amount, blockchain, address } = req.body;

      if (!fromCoin || !toCoin || !amount || !blockchain) return res.status(400).send({ message: "Invalid data." });

      const previewData = await this.swapService.getPreviewSwap(fromCoin, toCoin, amount, blockchain, address);
      res.send(previewData);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  public sendSwap = async (req: Request, res: Response) => {
    try {
      const { defixId, fromCoin, toCoin, pkEncrypt, priceRoute, blockchain } = req.body;

      if (!fromCoin || !toCoin || !defixId || !priceRoute || !pkEncrypt || !blockchain) return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      const address = await UtilsShared.getAddressUser(defixId, blockchain);

      if (!address) return res.status(400).send({ message: "Address invalid." });

      const swapResult = await this.swapService.sendSwap(defixId, fromCoin, toCoin, priceRoute, privateKey, blockchain, address);

      this.mailService.emailSuccessSwap(
        defixId,
        fromCoin,
        swapResult.amount,
        toCoin,
        swapResult.destAmount,
        blockchain,
        swapResult.hash,
        swapResult.createdAt
      );

      res.send(swapResult);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
