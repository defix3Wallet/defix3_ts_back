import { Request, Response } from "express";
import { TransferService } from "../services/transfer.service";

export class TransferController {
  private transferService: TransferService;

  constructor() {
    this.transferService = new TransferService();
  }

  // public setEmailSubscription = async (req: Request, res: Response) => {
  //   try {
  //     const { email } = req.body;
  //     if (!email) return res.status(400).send({ message: "Invalid data." });
  //     return await this.subscriptionService.createSubscription(email);
  //   } catch (error: any) {
  //     return res.status(500).send({ message: error.message });
  //   }
  // };
}
