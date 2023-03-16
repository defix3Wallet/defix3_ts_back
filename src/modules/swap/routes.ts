import { Express, Router } from "express";
import { SwapController } from "./controllers/swap.controller";
import { TwoFAMiddleware } from "../../shared/middlewares/twoFA.middleware";

export class Routes {
  private controller: SwapController;
  private middleware2fa: TwoFAMiddleware;

  constructor(router: Router, controller: SwapController) {
    this.controller = controller;
    this.middleware2fa = new TwoFAMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * @swagger
     * /get-preview-swap/:
     *    post:
     *      tags:
     *        - Swap
     *      summary: Obtiene el Preview del swap, Tasa de cambio, hash y monto recibido..
     *      description: Manda campos requeridos para obtener el priceRoute.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [fromCoin, toCoin, amount, blockchain]
     *                properties: {
     *                  fromCoin: {
     *                    type: "string"
     *                  },
     *                  toCoin: {
     *                    type: "string"
     *                  },
     *                  amount: {
     *                    type: "number"
     *                  },
     *                  blockchain: {
     *                    type: "string"
     *                  },
     *                  address: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve el preview o priceRoute del swap a realizar.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Bad Request.
     */
    router.post("/get-preview-swap/", this.controller.getPreviewSwap);
  }
}
