import { Request, Response } from "express";
import { HiddenTokensService } from "../services/hiddenTokens.service";

export class HiddenTokensController {
  private hiddenTokensService: HiddenTokensService;

  constructor() {
    this.hiddenTokensService = new HiddenTokensService();
  }

  public getTokensByDefixId = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const cryptos = await this.hiddenTokensService.getTokensByDefixId(defixId);
      res.send(cryptos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public changeHiddenToken = async (req: Request, res: Response) => {
    try {
      const { defixId, tokenId, active } = req.body;
      const hiddenToken = await this.hiddenTokensService.getHiddenTokenById(defixId, tokenId);
      if (active && !hiddenToken) {
        const response = await this.hiddenTokensService.createHiddenToken(defixId, tokenId);
        res.send(response);
      } else if (!active && hiddenToken) {
        const response = await this.hiddenTokensService.deleteHiddenToken(hiddenToken.id);
        res.send(response);
      } else {
        return res.status(200).send();
      }
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
