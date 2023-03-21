import { Express, Router } from "express";
import { TransactionHistoryController } from "./controllers/transactionHistory.controller";

export class Routes {
  private controller: TransactionHistoryController;

  constructor(router: Router, controller: TransactionHistoryController) {
    this.controller = controller;
    this.configureRoutes(router);
  }

  private configureRoutes(router: Router) {
    /**
     * @swagger
     * /transaction-history/:
     *    post:
     *      tags:
     *        - TransactionHistory
     *      summary: Historico de transacciones.
     *      description: Obtener historico de transacciones de un usuario.
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
     *                  blockchain: {
     *                    type: "string"
     *                  },
     *                  coin: {
     *                    type: "string"
     *                  },
     *                  hash: {
     *                    type: "string"
     *                  },
     *                  typeTxn: {
     *                    type: "string"
     *                  },
     *                }
     *      responses:
     *        '200':
     *          description: Devuelve array de transacciones.
     *        '400':
     *          description: Bad Request.
     *        '500':
     *          description: Internal Server Error.
     */
    router.post("/transaction-history/", this.controller.getTransactionHistory);
  }
}
