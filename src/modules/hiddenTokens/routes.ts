import { Express, Router } from "express";
import { HiddenTokensController } from "./controllers/hiddenTokens.controller";

export class Routes {
  private controller: HiddenTokensController;

  constructor(router: Router, controller: HiddenTokensController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * Post track
     * @swagger
     * /get-hidden-tokens/:
     *    post:
     *      tags:
     *        - LimitOrder
     *      summary: Traer la lista de tokens preferencia del usuario.
     *      description: Responde array de tokens.
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
     *          description: Responde un array.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Bad Request.
     */
    router.post("/get-hidden-tokens/", this.controller.getTokensByDefixId);

    /**
     * Post track
     * @swagger
     * /change-hidden-token/:
     *    post:
     *      tags:
     *        - LimitOrder
     *      summary: Agrega o elimina el token de la lista de tokens a ocultar.
     *      description: Manda active = true para ocultar el token, false para eliminarlo.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: ["defixId", "tokenId", "active"]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  tokenId: {
     *                    type: "number"
     *                  },
     *                  active: {
     *                    type: "boolean"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Success.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post("/change-hidden-token/", this.controller.changeHiddenToken);
  }
}
