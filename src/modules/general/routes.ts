import { Express, Router } from "express";
import { GeneralController } from "./controllers/general.controller";
import { SharedMiddleware } from "../../shared/middlewares/middleware.shared";

export class Routes {
  private controller: GeneralController;
  private middleware: SharedMiddleware;

  constructor(router: Router, controller: GeneralController) {
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
