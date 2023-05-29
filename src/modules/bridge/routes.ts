import { Express, Router } from "express";
import { BridgeController } from "./controllers/bridge.controller";

export class Routes {
  private controller: BridgeController;

  constructor(router: Router, controller: BridgeController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post("/get-fee-bridge/", this.controller.getFeeBridge);
  }
}
