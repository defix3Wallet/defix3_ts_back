import { Request, Response } from "express";
import { GeneralService } from "../services/general.service";

export class GeneralController {
  private generalService: GeneralService;

  constructor() {
    this.generalService = new GeneralService();
  }
  public getBalance = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const balance = await this.generalService.getBalance(defixId);
      res.send(balance);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };
}
