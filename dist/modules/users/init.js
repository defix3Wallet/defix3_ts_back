"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const user_controller_1 = require("./controllers/user.controller");
const routes_user_1 = require("./routes.user");
const routes_twoFA_1 = require("./routes.twoFA");
const twoFA_controller_1 = require("./controllers/twoFA.controller");
class UsersModule {
    constructor(router) {
        this.routes = new routes_user_1.RoutesUser(router, new user_controller_1.UserController());
        this.routesTwoFA = new routes_twoFA_1.RoutesTwoFA(router, new twoFA_controller_1.TwoFAController());
    }
}
exports.UsersModule = UsersModule;
