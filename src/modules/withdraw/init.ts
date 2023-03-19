import { Express, Router } from "express";
import { WithdrawController } from "./controllers/withdraw.controller";
import { Routes } from "./routes";

export class WithdrawModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new WithdrawController());
  }
}
