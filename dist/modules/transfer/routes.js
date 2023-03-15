"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
class Routes {
    constructor(router, controller) {
        this.controller = controller;
        this.configureRoutes(router);
    }
    configureRoutes(router) {
        router.post("/send-transfer/", this.controller.sendTransfer);
    }
}
exports.Routes = Routes;
