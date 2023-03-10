import { Express, Router } from "express";
import { TransactionHistoryController } from "./controllers/transactionHistory.controller";
import { Routes } from "./routes";

export class TransactionHistoryModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new TransactionHistoryController());
  }
}
