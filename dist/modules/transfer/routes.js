"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const twoFA_middleware_1 = require("../../shared/middlewares/twoFA.middleware");
class Routes {
    constructor(router, controller) {
        this.controller = controller;
        this.middleware2fa = new twoFA_middleware_1.TwoFAMiddleware();
        this.configureRoutes(router);
    }
    configureRoutes(router) {
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
        router.post("/send-transfer/", this.middleware2fa.validateTwoFA, this.controller.sendTransfer);
    }
}
exports.Routes = Routes;
