import { Express, Router } from "express";
import { BalanceController } from "./controllers/balance.controller";
import { SharedMiddleware } from "../../shared/middlewares/middleware.shared";

export class Routes {
  private controller: BalanceController;
  private middleware: SharedMiddleware;

  constructor(router: Router, controller: BalanceController) {
    this.controller = controller;
    this.middleware = new SharedMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post(
      "/get-balance/",
      this.middleware.defixIdValid,
      this.controller.getBalance
    );
  }
}
