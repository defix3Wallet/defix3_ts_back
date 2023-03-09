import { Express, Router } from "express";
import { BalanceController } from "./controllers/balance.controller";
import { SharedMiddleware } from "../../shared/middlewares/middleware.shared";

export class Routes {
  private controller: BalanceController;
  private middleware: SharedMiddleware;

  constructor(router: Router, controller: BalanceController) {
    this.controller = controller;
    this.middleware = new SharedMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * Post track
     * @swagger
     * /get-balance/:
     *    post:
     *      tags:
     *        - Balance
     *      summary: Obtener balance de un Usuario.
     *      description: Mandar defixId y te dara el balance de ese usuario, con todos las cryptos y tokens.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Array con balance de todas las cryptos del usuario.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Bad Request.
     */
    router.post(
      "/get-balance/",
      this.middleware.defixIdValid,
      this.controller.getBalance
    );
  }
}
