"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapModule = void 0;
const swap_controller_1 = require("./controllers/swap.controller");
const routes_1 = require("./routes");
class SwapModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new swap_controller_1.SwapController());
    }
}
exports.SwapModule = SwapModule;
