"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
class Routes {
    constructor(router, controller) {
        this.controller = controller;
        this.configureRoutes(router);
    }
    configureRoutes(router) {
        /**
         * @swagger
         * /get-frequent/:
         *    post:
         *      tags:
         *        - Frequent
         *      summary: Obtener lista de usuarios frequentes.
         *      description: Obtener lista de usuarios frequentes de un usuario.
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
         *          description: Devuelve array de usuarios.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Internal Server Error.
         */
        router.post("/get-frequent/", this.controller.getAllFrequent);
        /**
         * @swagger
         * /delete-frequent/:
         *    post:
         *      tags:
         *        - Frequent
         *      summary: Eliminar user frequent.
         *      description: Elimina un usuario de tu lista de frequentes.
         *      requestBody:
         *          content:
         *            application/json:
         *              schema:
         *                type: "object"
         *                required: [id]
         *                properties: {
         *                  id: {
         *                    type: number
         *                  }
         *                }
         *      responses:
         *        '204':
         *          description: Eliminado con exito.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Internal Server Error.
         */
        router.post("/delete-frequent/", this.controller.deleteFrequent);
    }
}
exports.Routes = Routes;
