"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressModule = void 0;
const address_controller_1 = require("./controllers/address.controller");
const routes_1 = require("./routes");
class AddressModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new address_controller_1.AddressController());
    }
}
exports.AddressModule = AddressModule;
