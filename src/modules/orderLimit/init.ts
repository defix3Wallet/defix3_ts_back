import { Express, Router } from "express";
import { LimitOrderController } from "./controllers/limitOrder.controller";
import { Routes } from "./routes";

export class LimitOrderModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new LimitOrderController());
  }
}
