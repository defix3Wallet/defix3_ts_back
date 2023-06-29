import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./config/swagger";
import { UsersModule } from "./modules/users/init";
import { WalletsModule } from "./modules/wallets/init";
import { AddressModule } from "./modules/address/init";
import { BalanceModule } from "./modules/balance/init";
import { SubscriptionModule } from "./modules/subscription/init";
import { GeneralModule } from "./modules/general/init";
import { TransactionHistoryModule } from "./modules/transactionHistory/init";
import { TransferModule } from "./modules/transfer/init";
import { FrequentModule } from "./modules/frequent/init";
import { SwapModule } from "./modules/swap/init";
import { LimitOrderModule } from "./modules/limitOrder/init";
import { WithdrawModule } from "./modules/withdraw/init";
import { HiddenTokensModule } from "./modules/hiddenTokens/init";
import { BridgeModule } from "./modules/bridge/init";

class App {
  public app: express.Express;
  public router: express.Router;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.config();
    this.initModules();
  }

  private config() {
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/api/v2", this.router);
    this.app.use("/uploads", express.static(path.resolve("./uploads/")));
    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSetup));
  }

  private initModules() {
    new AddressModule(this.router);
    new WalletsModule(this.router);
    new UsersModule(this.router);
    new BalanceModule(this.router);
    new SubscriptionModule(this.router);
    new GeneralModule(this.router);
    new TransactionHistoryModule(this.router);
    new TransferModule(this.router);
    new WithdrawModule(this.router);
    new SwapModule(this.router);
    new LimitOrderModule(this.router);
    new FrequentModule(this.router);
    new HiddenTokensModule(this.router);
    new BridgeModule(this.router);
  }
}

export default new App().app;
