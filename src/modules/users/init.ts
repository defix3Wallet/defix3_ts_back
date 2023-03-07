import { Express, Router } from "express";
import { UserController } from "./controllers/user.controller";
import { Routes } from "./routes";

export class UsersModule {
  public routes: Routes;

  constructor(router: Router) {
    this.routes = new Routes(router, new UserController());
  }
}
