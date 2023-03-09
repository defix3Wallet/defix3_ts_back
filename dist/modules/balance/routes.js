"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const middleware_shared_1 = require("../../shared/middlewares/middleware.shared");
class Routes {
    constructor(router, controller) {
        this.controller = controller;
        this.middleware = new middleware_shared_1.SharedMiddleware();
        this.configureRoutes(router);
    }
    configureRoutes(router) {
        router.post("/get-balance/", this.middleware.defixIdValid, this.controller.getBalance);
    }
}
exports.Routes = Routes;
