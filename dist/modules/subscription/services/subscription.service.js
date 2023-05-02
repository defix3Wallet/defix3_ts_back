"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const subscription_entity_1 = require("../entities/subscription.entity");
class SubscriptionService {
    constructor() {
        this.createSubscription = async (email) => {
            try {
                const subscription = new subscription_entity_1.SubscriptionEntity();
                if (!(await utils_shared_1.UtilsShared.validateEmail(email)))
                    throw new Error(`Invalid email`);
                subscription.email = email;
                return await subscription.save();
            }
            catch (err) {
                throw new Error(`Failed to create subscription: ${err}`);
            }
        };
    }
}
exports.SubscriptionService = SubscriptionService;
