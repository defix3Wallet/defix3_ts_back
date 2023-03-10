"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const middleware_shared_1 = require("../../shared/middlewares/middleware.shared");
class Routes {
    constructor(router, controller) {
        this.controller = controller;
        this.middleware = new middleware_shared_1.SharedMiddleware();
        this.configureRoutes(router);
    }
    configureRoutes(router) {
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
    }
}
exports.Routes = Routes;
