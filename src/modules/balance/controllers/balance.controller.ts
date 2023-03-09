import { Request, Response } from "express";
import { BalanceService } from "../services/balance.service";

export class BalanceController {
  private balanceService: BalanceService;

  constructor() {
    this.balanceService = new BalanceService();
  }
  public getBalance = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const balance = await this.balanceService.getBalance(defixId);
      res.send(balance);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };
}
