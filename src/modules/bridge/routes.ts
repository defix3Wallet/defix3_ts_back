import { Express, Router } from "express";
import { BridgeController } from "./controllers/bridge.controller";

export class Routes {
  private controller: BridgeController;

  constructor(router: Router, controller: BridgeController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * @swagger
     * /get-fee-bridge/:
     *    post:
     *      tags:
     *        - Bridge
     *      summary: Obtener fee de un bridge segun la blockchain.
     *      description: Manda campos requeridos para obtener un fee en USD.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [chainTo, amount, coin, chainFrom]
     *                properties: {
     *                  chainFrom: {
     *                    type: "string"
     *                  },
     *                  chainTo: {
     *                    type: "string"
     *                  },
     *                  coin: {
     *                    type: "string"
     *                  },
     *                  amount: {
     *                    type: "string"
     *                  },
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve el fee que se cobraria por hacer un bridge.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post("/get-fee-bridge/", this.controller.getFeeBridge);

    /**
     * @swagger
     * /get-tokens-bridge/:
     *    post:
     *      tags:
     *        - Bridge
     *      summary: Obtener lista de tokens a los que puedes enviar segun el Chain.
     *      description: Envia una blockchain y obten a que otras chain puedes enviar.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [coin, blockchain]
     *                properties: {
     *                  blockchain: {
     *                    type: "string"
     *                  },
     *                  coin: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve el array de tokens.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post("/get-tokens-bridge/", this.controller.getAddressesBridge);

    /**
     * @swagger
     * /send-bridge/:
     *    post:
     *      tags:
     *        - Bridge
     *      summary: Obtener lista de tokens a los que puedes enviar segun el Chain.
     *      description: Envia una blockchain y obten a que otras chain puedes enviar.
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: "object"
     *                required: [defixId, pkEncrypt, toAddress, coin, amount, fromChain, toChain]
     *                properties: {
     *                  defixId: {
     *                    type: "string"
     *                  },
     *                  pkEncrypt: {
     *                    type: "string"
     *                  },
     *                  toAddress: {
     *                    type: "string"
     *                  },
     *                  coin: {
     *                    type: "string"
     *                  },
     *                  amount: {
     *                    type: "string"
     *                  },
     *                  fromChain: {
     *                    type: "string"
     *                  },
     *                  toChain: {
     *                    type: "string"
     *                  }
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve result.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post("/send-bridge/", this.controller.sendBridge);
  }
}
