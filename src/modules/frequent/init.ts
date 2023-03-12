import { Express, Router } from "express";
import { FrequentController } from "./controllers/frequent.controller";
import { Routes } from "./routes";

export class FrequentModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new FrequentController());
  }
}
