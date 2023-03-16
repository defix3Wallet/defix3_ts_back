import { Request, Response } from "express";
import { SwapService } from "../services/swap.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { MailShared } from "../../../shared/email/email.shared";

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

      if (!fromCoin || !toCoin || !amount || !blockchain)
        return res.status(400).send({ message: "Invalid data." });

      const previewData = await this.swapService.getPreviewSwap(
        fromCoin,
        toCoin,
        amount,
        blockchain,
        address
      );
      res.send(previewData);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
