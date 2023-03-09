import { Express, Router } from "express";
import { BalanceController } from "./controllers/balance.controller";
import { Routes } from "./routes";

export class BalanceModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new BalanceController());
  }
}
