import { Express, Router } from "express";
import { GeneralController } from "./controllers/general.controller";
import { Routes } from "./routes";

export class GeneralModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new GeneralController());
  }
}
