import { Express, Router } from "express";
import { BridgeController } from "./controllers/bridge.controller";
import { Routes } from "./routes";

export class BridgeModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new BridgeController());
  }
}
