import { Express, Router } from "express";
import { WalletController } from "./controllers/wallet.controller";

export class Routes {
  private routeController: WalletController;

  constructor(router: Router, routeController: WalletController) {
    this.routeController = routeController;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post("/create-wallet/", this.routeController.createWalletDefix);
  }
}
