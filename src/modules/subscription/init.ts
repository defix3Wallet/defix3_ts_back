import { Express, Router } from "express";
import { SubscriptionController } from "./controllers/subscription.controller";
import { Routes } from "./routes";

export class SubscriptionModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new SubscriptionController());
  }
}
