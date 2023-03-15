"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralModule = void 0;
const general_controller_1 = require("./controllers/general.controller");
const routes_1 = require("./routes");
class GeneralModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new general_controller_1.GeneralController());
    }
}
exports.GeneralModule = GeneralModule;
