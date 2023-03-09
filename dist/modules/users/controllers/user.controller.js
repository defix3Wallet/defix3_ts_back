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
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.validateDefixId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId } = req.body;
                const user = yield this.userService.getUserByDefixId(defixId);
                if (!user)
                    return res.send(false);
                return res.send(true);
            }
            catch (error) {
                return res.status(500).send({ message: error });
            }
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getUsers();
                res.send(users);
            }
            catch (error) {
                return res.status(500).send({ message: error });
            }
        });
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
