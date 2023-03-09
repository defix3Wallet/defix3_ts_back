"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const user_controller_1 = require("./controllers/user.controller");
const routes_1 = require("./routes");
class UsersModule {
    constructor(router) {
        this.routes = new routes_1.Routes(router, new user_controller_1.UserController());
    }
}
exports.UsersModule = UsersModule;
