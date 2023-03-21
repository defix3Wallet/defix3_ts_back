import { Express, Router } from "express";
import { TransferController } from "./controllers/transfer.controller";
import { TwoFAMiddleware } from "../../shared/middlewares/twoFA.middleware";

export class Routes {
  private controller: TransferController;
  private middleware2fa: TwoFAMiddleware;

  constructor(router: Router, controller: TransferController) {
    this.controller = controller;
    this.middleware2fa = new TwoFAMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * @swagger
     * /get-fee-transfer/:
     *    post:
     *      tags:
     *        - Transfer
     *      summary: Obtiene el fee de la transferencia..
     *      description: Manda campos requeridos para obtener el fee.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [coin, blockchain]
     *                properties: {
     *                  coin: {
     *                    type: "string"
     *                  },
     *                  blockchain: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve el preview de la transfer.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Bad Request.
     */
    router.post("/get-fee-transfer/", this.controller.getFeeTransfer);

    /**
     * @swagger
     * /send-transfer/:
     *    post:
     *      tags:
     *        - Transfer
     *      summary: Hacer transferencia.
     *      description: Manda campos requeridos para hacer una transaction.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId, pkEncrypt, toDefix, coin, amount, blockchain]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  pkEncrypt: {
     *                    type: "string"
     *                  },
     *                  toDefix: {
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
      "/send-transfer/",
      this.middleware2fa.validateTwoFA,
      this.controller.sendTransfer
    );
  }
}
