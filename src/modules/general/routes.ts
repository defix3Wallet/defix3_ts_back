import { Express, Router } from "express";
import { GeneralController } from "./controllers/general.controller";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";

export class Routes {
  private controller: GeneralController;
  private middleware: SharedMiddleware;

  constructor(router: Router, controller: GeneralController) {
    this.controller = controller;
    this.middleware = new SharedMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * Post track
     * @swagger
     * /get-cryptos:
     *    get:
     *      tags:
     *        - General
     *      summary: Obtiene las Cryptos y Tokens permitidos en Defix3.
     *      description: Te da un array con las cryptos y tokens.
     *      responses:
     *        '200':
     *          description: Array con las cryptos y tokens.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.get("/get-cryptos", this.controller.getCryptos);

    /**
     * Post track
     * @swagger
     * /get-cryptos-swap:
     *    get:
     *      tags:
     *        - General
     *      summary: Obtiene las Cryptos y Tokens permitidos en Defix3.
     *      description: Te da un array con las cryptos y tokens.
     *      responses:
     *        '200':
     *          description: Array con las cryptos y tokens.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.get("/get-cryptos-swap", this.controller.getCryptosSwap);

    /**
     * Post track
     * @swagger
     * /get-cryptos-limit:
     *    get:
     *      tags:
     *        - General
     *      summary: Obtiene las Cryptos y Tokens permitidos en Defix3.
     *      description: Te da un array con las cryptos y tokens.
     *      responses:
     *        '200':
     *          description: Array con las cryptos y tokens.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.get("/get-cryptos-limit", this.controller.getCryptosLimit);
  }
}
