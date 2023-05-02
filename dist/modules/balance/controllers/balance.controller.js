"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceController = void 0;
const balance_service_1 = require("../services/balance.service");
class BalanceController {
    constructor() {
        this.getBalance = async (req, res) => {
            try {
                const { defixId } = req.body;
                const balance = await this.balanceService.getBalance(defixId);
                res.send(balance);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.balanceService = new balance_service_1.BalanceService();
    }
}
exports.BalanceController = BalanceController;
