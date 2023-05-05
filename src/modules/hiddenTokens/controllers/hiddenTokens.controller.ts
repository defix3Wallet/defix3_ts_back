import { Request, Response } from "express";
import { HiddenTokensService } from "../services/hiddenTokens.service";

export class HiddenTokensController {
  private hiddenTokensService: HiddenTokensService;

  constructor() {
    this.hiddenTokensService = new HiddenTokensService();
  }

  public getHiddenTokensByDefixId = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const cryptos = await this.hiddenTokensService.getHiddenTokensByDefixId(defixId);
      res.send(cryptos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
