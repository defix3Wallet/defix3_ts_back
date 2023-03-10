"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const subscription_controller_1 = require("./controllers/subscription.controller");
const routes_1 = require("./routes");
class SubscriptionModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new subscription_controller_1.SubscriptionController());
    }
}
exports.SubscriptionModule = SubscriptionModule;
