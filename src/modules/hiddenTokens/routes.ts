import { Express, Router } from "express";
import { HiddenTokensController } from "./controllers/hiddenTokens.controller";

export class Routes {
  private controller: HiddenTokensController;

  constructor(router: Router, controller: HiddenTokensController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post("/get-hidden-tokens/", this.controller.getHiddenTokensByDefixId);
  }
}
