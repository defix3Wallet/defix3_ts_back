import { Express } from "express";
import { UserController } from "./controllers/userController";
import { Routes } from "./routes";

export class UsersModule {
  public routes: Routes;

  constructor(app: Express) {
    this.routes = new Routes(app, new UserController());
  }
}
