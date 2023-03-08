import { Express, Router } from "express";
import { WalletController } from "./controllers/wallet.controller";

export class Routes {
  private controller: WalletController;

  constructor(router: Router, controller: WalletController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post("/create-wallet/", this.controller.createWalletDefix);
  }
}
