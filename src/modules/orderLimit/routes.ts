import { Express, Router } from "express";
import { LimitOrderController } from "./controllers/limitOrder.controller";
import { TwoFAMiddleware } from "../../shared/middlewares/twoFA.middleware";

export class Routes {
  private controller: LimitOrderController;
  private middleware2fa: TwoFAMiddleware;

  constructor(router: Router, controller: LimitOrderController) {
    this.controller = controller;
    this.middleware2fa = new TwoFAMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * @swagger
     * /send-limit-order/:
     *    post:
     *      tags:
     *        - LimitOrder
     *      summary: Envia el limit order, Tasa de cambio, hash y monto recibido..
     *      description: Manda campos requeridos para hacer un order limit.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [fromCoin, toCoin, amount, blockchain]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  pkEncrypt: {
     *                    type: "string"
     *                  },
     *                  fromCoin: {
     *                    type: "string"
     *                  },
     *                  toCoin: {
     *                    type: "string"
     *                  },
     *                  srcAmount: {
     *                    type: "number"
     *                  },
     *                  destAmount: {
     *                    type: "number"
     *                  },
     *                  blockchain: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve la transaccion del Order Limit.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post("/send-limit-order/", this.controller.sendLimitOrder);

    router.post("/cancel-limit-order/", this.controller.cancelAllLimitOrder);
  }
}
