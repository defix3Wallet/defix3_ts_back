import { Express, Router } from "express";
import { SubscriptionController } from "./controllers/subscription.controller";

export class Routes {
  private controller: SubscriptionController;

  constructor(router: Router, controller: SubscriptionController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * Post track
     * @swagger
     * /create-subscription/:
     *    post:
     *      tags:
     *        - Subscription
     *      summary: Enviar correo para subscribirse a Defix3.
     *      description: Registrar correo.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [email]
     *                properties: {
     *                  email: {
     *                    type: "string"
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
    router.post("/create-subscription/", this.controller.setEmailSubscription);
  }
}
