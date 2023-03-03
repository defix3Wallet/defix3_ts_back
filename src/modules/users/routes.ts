import { Express } from "express";
import { UserController } from "./controllers/userController";

export class Routes {
  private routeController: UserController;

  constructor(app: Express, routeController: UserController) {
    this.routeController = routeController;
    this.configureRoutes(app);
  }

  private configureRoutes(app: Express) {
    app.route("/users").get(this.routeController.getUser);
  }
}
