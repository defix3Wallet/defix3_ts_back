"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesUser = void 0;
const shared_middleware_1 = require("../../shared/middlewares/shared.middleware");
const multer_1 = __importDefault(require("../../config/multer"));
class RoutesUser {
    constructor(router, controller) {
        this.controller = controller;
        this.middleware = new shared_middleware_1.SharedMiddleware();
        this.multerConfig = new multer_1.default();
        this.configureRoutes(router);
    }
    configureRoutes(router) {
        /**
         * Post track
         * @swagger
         * /validate-defix3/:
         *    post:
         *      tags:
         *        - User
         *      summary: Validar si un usuario defix3 existe.
         *      description: Response un Boolean si el usuario existe o no.
         *      requestBody:
         *          content:
         *            application/json:
         *              schema:
         *                type: "object"
         *                required: ["defixId"]
         *                properties: {
         *                  defixId: {
         *                    type: "string"
         *                  }
         *                }
         *      responses:
         *        '200':
         *          description: Responde un boolean.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Bad Request.
         */
        router.post("/validate-defix3/", this.middleware.defixIdAvailable, this.controller.validateDefixId);
        /**
         * Post track
         * @swagger
         * /get-users:
         *    get:
         *      tags:
         *        - User
         *      summary: Lista los username de los usuarios registrados.
         *      description: Responde solo el defixId de los usuarios.
         *      responses:
         *        '200':
         *          description: Responde un Array con la lista de usuarios.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Bad Request.
         */
        router.get("/get-users", this.controller.getUsers);
        /**
         * Post track
         * @swagger
         * /get-user-data/:
         *    post:
         *      tags:
         *        - User
         *      summary: Obtiene la data de configuracion del usuario.
         *      description: Obtiene data del defixId enviado.
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
         *          description: Responde objeto con la data.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Bad Request.
         */
        router.post("/get-user-data/", this.middleware.defixIdValid, this.controller.getUserData);
        /**
         * Post track
         * @swagger
         * /update-user/:
         *    patch:
         *      tags:
         *        - User
         *      summary: Actualizar data del usuario.
         *      description: Manda data para actualizar el usuario.
         *      requestBody:
         *          content:
         *            application/json:
         *              schema:
         *                type: "object"
         *                required: [defixId]
         *                properties: {
         *                  defixId: {
         *                    type: "string"
         *                  },
         *                }
         *      responses:
         *        '200':
         *          description: Buena respuesta.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Internal server error.
         */
        router.patch("/update-user/", this.multerConfig.upload().single("avatar"), this.controller.updateUser);
    }
}
exports.RoutesUser = RoutesUser;
