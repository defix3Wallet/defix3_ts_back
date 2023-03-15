"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequentModule = void 0;
const frequent_controller_1 = require("./controllers/frequent.controller");
const routes_1 = require("./routes");
class FrequentModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new frequent_controller_1.FrequentController());
    }
}
exports.FrequentModule = FrequentModule;
