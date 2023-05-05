import { Express, Router } from "express";
import { HiddenTokensController } from "./controllers/hiddenTokens.controller";
import { Routes } from "./routes";

export class HiddenTokensModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new HiddenTokensController());
  }
}
