"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const subscription_entity_1 = require("../entities/subscription.entity");
class SubscriptionService {
    constructor() {
        this.createSubscription = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = new subscription_entity_1.SubscriptionEntity();
                if (!(yield utils_shared_1.UtilsShared.validateEmail(email)))
                    throw new Error(`Invalid email`);
                subscription.email = email;
                return yield subscription.save();
            }
            catch (err) {
                throw new Error(`Failed to create subscription: ${err}`);
            }
        });
    }
}
exports.SubscriptionService = SubscriptionService;
