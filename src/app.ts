import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { UsersModule } from "./modules/users/init";

class App {
  public app: express.Express;
  public router: express.Router;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.config();
    this.initModules();
  }

  private async config(): Promise<void> {
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/api/v2", this.router);
  }

  private initModules() {
    new UsersModule(this.router);
  }
}

export default new App().app;
