import { Express, Router } from "express";
import { LimitOrderController } from "./controllers/limitOrder.controller";
import { TwoFAMiddleware } from "../../shared/middlewares/twoFA.middleware";

export class Routes {
  private controller: LimitOrderController;
  private middleware2fa: TwoFAMiddleware;

  constructor(router: Router, controller: LimitOrderController) {
    this.controller = controller;
    this.middleware2fa = new TwoFAMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post("/get-limit-order/", this.controller.getLimitOrder);
  }
}
