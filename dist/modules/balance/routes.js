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
         *          description: Internal Server Error.
         */
        router.post("/get-balance/", this.middleware.defixIdValid, this.controller.getBalance);
    }
}
exports.Routes = Routes;
