import { Express, Router } from "express";
import { AddressController } from "./controllers/address.controller";
import { Routes } from "./routes";

export class AddressModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new AddressController());
  }
}
