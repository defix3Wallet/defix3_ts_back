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
exports.Routes = Routes;
