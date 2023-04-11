import { Request, Response } from "express";
import { TransactionHistoryService } from "../services/transactionHistory.service";

export class TransactionHistoryController {
  private transactionHistory: TransactionHistoryService;

  constructor() {
    this.transactionHistory = new TransactionHistoryService();
  }

  public getTransactionHistory = async (req: Request, res: Response) => {
    try {
      const { defixId, blockchain, coin, hash, typeTxn } = req.body;
      const transactions = await this.transactionHistory.getTransactionHistory(defixId, coin, blockchain, hash, typeTxn);
      res.send(transactions);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
