import { Express, Router } from "express";
import { UserController } from "./controllers/user.controller";
import { RoutesUser } from "./routes.user";
import { RoutesTwoFA } from "./routes.twoFA";
import { TwoFAController } from "./controllers/twoFA.controller";

export class UsersModule {
  public routes: RoutesUser;
  public routesTwoFA: RoutesTwoFA;

  constructor(router: Router) {
    this.routes = new RoutesUser(router, new UserController());
    this.routesTwoFA = new RoutesTwoFA(router, new TwoFAController());
  }
}
