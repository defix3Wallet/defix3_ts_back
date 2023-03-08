import { Express, Router } from "express";
import { AddressController } from "./controllers/address.controller";

export class Routes {
  private controller: AddressController;

  constructor(router: Router, controller: AddressController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {}
}
