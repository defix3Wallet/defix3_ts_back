import { Express, Router } from "express";
import { WalletController } from "./controllers/wallet.controller";
import { Routes } from "./routes";

export class WalletsModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new WalletController());
  }
}
