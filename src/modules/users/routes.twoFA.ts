import { Express, Router } from "express";
import { SharedMiddleware } from "../../shared/middlewares/middleware.shared";
import { TwoFAController } from "./controllers/twoFA.controller";
export class RoutesTwoFA {
  private controller: TwoFAController;
  private middleware: SharedMiddleware;

  constructor(router: Router, controller: TwoFAController) {
    this.controller = controller;
    this.middleware = new SharedMiddleware();
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * Post track
     * @swagger
     * /generate-2fa/:
     *    post:
     *      tags:
     *        - 2FA
     *      summary: Generar 2FA.
     *      description: Mandar defixId y seedPhrase encriptado para generar un 2fa para el usuario.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId, seedPhrase]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve el qr y el codigo 2fa.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post(
      "/generate-2fa/",
      this.middleware.defixIdValid,
      this.controller.generateTwoFA
    );

    /**
     * Post track
     * @swagger
     * /activate-2fa/:
     *    post:
     *      tags:
     *        - 2FA
     *      summary: Activar 2FA.
     *      description: Activa el 2fa en la base de datos del usuario.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId, seedPhrase, code]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  code: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '204':
     *          description: Success.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post(
      "/activate-2fa/",
      this.middleware.defixIdValid,
      this.controller.activateTwoFA
    );

    /**
     * Post track
     * @swagger
     * /deactivate-2fa/:
     *    post:
     *      tags:
     *        - 2FA
     *      summary: Desactivar 2FA.
     *      description: Desactiva el 2fa en la base de datos del usuario.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId, code]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  code: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '204':
     *          description: Success.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post(
      "/deactivate-2fa/",
      this.middleware.defixIdValid,
      this.controller.deactivateTwoFA
    );

    /**
     * Post track
     * @swagger
     * /status-2fa/:
     *    post:
     *      tags:
     *        - 2FA
     *      summary: Status 2FA.
     *      description: Te da un Status del 2FA del usuario.
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
     *          description: Devuelve un boolean si el 2FA esta activo o no.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post(
      "/status-2fa/",
      this.middleware.defixIdValid,
      this.controller.statusTwoFA
    );
  }
}
