"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const shared_middleware_1 = require("../../shared/middlewares/shared.middleware");
class Routes {
    constructor(router, controller) {
        this.controller = controller;
        this.middleware = new shared_middleware_1.SharedMiddleware();
        this.configureRoutes(router);
    }
    configureRoutes(router) {
        /**
         * Post track
         * @swagger
         * /create-wallet/:
         *    post:
         *      tags:
         *        - Wallet
         *      summary: Crear wallet Defix3
         *      description: Te registra y crea una wallet Defix3 con todos los address de las blockchains admitidas.
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
         *                  seedPhrase: {
         *                    type: "string"
         *                  },
         *                  email: {
         *                    type: "string"
         *                  },
         *                }
         *      responses:
         *        '200':
         *          description: Responde un Json con todas las credenciales y address de la wallet.
         *        '204':
         *          description: Bad Request.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Bad Request.
         */
        router.post("/create-wallet/", this.middleware.defixIdAvailable, this.controller.createWalletDefix);
        /**
         * Post track
         * @swagger
         * /import-wallet/:
         *    post:
         *      tags:
         *        - Wallet
         *      summary: Iniciar Sesion con wallet Defix3
         *      description: Ingresa el seedPhrase y te devuelve el username defix3 y las credenciales de la wallet.
         *      requestBody:
         *          content:
         *            application/json:
         *              schema:
         *                type: "object"
         *                required: [seedPhrase]
         *                properties: {
         *                  seedPhrase: {
         *                    type: "string"
         *                  }
         *                }
         *      responses:
         *        '200':
         *          description: Al igual que create, responde un Json con todas las credenciales y address de la wallet.
         *        '204':
         *          description: Bad Request.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Internal server error.
         */
        router.post("/import-wallet/", this.controller.importWalletDefix);
        /**
         * Post track
         * @swagger
         * /import-from-pk/:
         *    post:
         *      tags:
         *        - Wallet
         *      summary: Inicicar sesion con private key
         *      description: Si colocas una private key te devuelve la credencial de la blockchain
         *      requestBody:
         *          content:
         *            application/json:
         *              schema:
         *                type: "object"
         *                required: ["pkEncrypt"]
         *                properties: {
         *                  pkEncrypt: {
         *                    type: "string"
         *                  }
         *                }
         *      responses:
         *        '200':
         *          description: Te response la credencial de la blockchain
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Internal server error.
         */
        router.post("/import-from-pk/", this.controller.importFromPrivateKey);
        /**
         * Post track
         * @swagger
         * /validate-address/:
         *    post:
         *      tags:
         *        - Wallet
         *      summary: Validar si un address es valido.
         *      description: Valida si el address existe en la blockchain segun el coin, "BTC", "ETH", "NEAR" ...
         *      requestBody:
         *          content:
         *            application/json:
         *              schema:
         *                type: "object"
         *                required: [address, blockchain]
         *                properties: {
         *                  address: {
         *                    type: "string"
         *                  },
         *                  blockchain: {
         *                    type: "string"
         *                  }
         *                }
         *      responses:
         *        '200':
         *          description: Responde un boolean.
         *        '400':
         *          description: Bad Request.
         *        '500':
         *          description: Internal server error.
         */
        router.post("/validate-address/", this.controller.validateAddress);
    }
}
exports.Routes = Routes;
