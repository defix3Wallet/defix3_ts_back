import { Express, Router } from "express";
import { TransferController } from "./controllers/transfer.controller";
import { Routes } from "./routes";

export class TransferModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new TransferController());
  }
}
