import { Express, Router } from "express";
import { SwapController } from "./controllers/swap.controller";
import { Routes } from "./routes";

export class SwapModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new SwapController());
  }
}
