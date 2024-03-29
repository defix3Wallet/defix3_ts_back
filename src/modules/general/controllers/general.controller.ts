import { Request, Response } from "express";
import { GeneralService } from "../services/general.service";

export class GeneralController {
  private generalService: GeneralService;

  constructor() {
    this.generalService = new GeneralService();
  }
  public getCryptos = async (req: Request, res: Response) => {
    try {
      const cryptos = await this.generalService.getCryptos();
      res.send(cryptos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
  public getCryptosSwap = async (req: Request, res: Response) => {
    try {
      const cryptos = await this.generalService.getCryptosSwap();
      res.send(cryptos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
  public getCryptosLimit = async (req: Request, res: Response) => {
    try {
      const cryptos = await this.generalService.getCryptosLimit();
      res.send(cryptos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
  public getCryptosBridge = async (req: Request, res: Response) => {
    try {
      const cryptos = await this.generalService.getCryptosBridge();
      res.send(cryptos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
