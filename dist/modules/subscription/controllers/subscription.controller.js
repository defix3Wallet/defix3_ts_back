"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const subscription_service_1 = require("../services/subscription.service");
class SubscriptionController {
    constructor() {
        this.setEmailSubscription = async (req, res) => {
            try {
                const { email } = req.body;
                if (!email)
                    return res.status(400).send({ message: "Invalid data." });
                return await this.subscriptionService.createSubscription(email);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.subscriptionService = new subscription_service_1.SubscriptionService();
    }
}
exports.SubscriptionController = SubscriptionController;
