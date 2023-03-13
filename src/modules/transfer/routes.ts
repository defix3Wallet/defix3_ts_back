import { Express, Router } from "express";
import { TransferController } from "./controllers/transfer.controller";

export class Routes {
  private controller: TransferController;

  constructor(router: Router, controller: TransferController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    router.post("/send-transfer/", this.controller.sendTransfer);
  }
}
