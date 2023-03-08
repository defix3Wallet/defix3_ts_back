import { Express, Router } from "express";
import { UserController } from "./controllers/user.controller";
import { SharedMiddleware } from "../../shared/middlewares/middleware.shared";
export class Routes {
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
     *        - Wallet
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
     *        - Wallet
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
  }
}
