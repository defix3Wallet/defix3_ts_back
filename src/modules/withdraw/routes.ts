import { Express, Router } from "express";
import { WithdrawController } from "./controllers/withdraw.controller";
import { TwoFAMiddleware } from "../../shared/middlewares/twoFA.middleware";

export class Routes {
  private controller: WithdrawController;
  private middleware2fa: TwoFAMiddleware;

  constructor(router: Router, controller: WithdrawController) {
    this.controller = controller;
    this.middleware2fa = new TwoFAMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * @swagger
     * /send-withdraw/:
     *    post:
     *      tags:
     *        - Withdraw
     *      summary: Hacer un retiro.
     *      description: Manda campos requeridos para hacer una transaction.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId, pkEncrypt, toAddress, coin, amount, blockchain]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  pkEncrypt: {
     *                    type: "string"
     *                  },
     *                  toAddress: {
     *                    type: "string"
     *                  },
     *                  coin: {
     *                    type: "string"
     *                  },
     *                  amount: {
     *                    type: "number"
     *                  },
     *                  blockchain: {
     *                    type: "string"
     *                  },
     *                  code2fa: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve la transaccion realizada.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post(
      "/send-withdraw/",
      this.middleware2fa.validateTwoFA,
      this.controller.sendWithdraw
    );
  }
}
