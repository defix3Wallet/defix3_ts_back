import { Express, Router } from "express";
import { UserController } from "./controllers/user.controller";
import { SharedMiddleware } from "../../shared/middlewares/middleware.shared";
export class RoutesUser {
  private controller: UserController;
  private middleware: SharedMiddleware;

  constructor(router: Router, controller: UserController) {
    this.controller = controller;
    this.middleware = new SharedMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
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
    router.post(
      "/validate-defix3/",
      this.middleware.defixIdAvailable,
      this.controller.validateDefixId
    );

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
    router.post(
      "/get-user-data/",
      this.middleware.defixIdValid,
      this.controller.getUserData
    );

    /**
     * Post track
     * @swagger
     * /update-user/:
     *    post:
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
    router.put(
      "/update-user/",
      this.middleware.defixIdValid,
      this.controller.updateUser
    );
  }
}
