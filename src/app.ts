import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { UsersModule } from "./modules/users/init";

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.initModules();
  }

  private async config(): Promise<void> {
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initModules() {
    new UsersModule(this.app);
  }
}

export default new App().app;
