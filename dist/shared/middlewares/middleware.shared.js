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
exports.SharedMiddleware = void 0;
const user_entity_1 = require("../../modules/users/entities/user.entity");
class SharedMiddleware {
    defixIdAvailable(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId } = req.body;
                if (!defixId || !defixId.includes(".defix3") || defixId.includes(" "))
                    return res.status(400).send({ message: "Error DefixId." });
                const user = yield user_entity_1.UserEntity.findOneBy({ defixId: defixId });
                if (user) {
                    return res.status(400).send({ message: "User already exists." });
                }
                next();
            }
            catch (err) {
                res.status(500).send({ message: "Internal server error." });
            }
        });
    }
    defixIdValid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId } = req.body;
                if (!defixId || !defixId.includes(".defix3") || defixId.includes(" "))
                    return res.status(400).send({ message: "Error DefixId." });
                const user = yield user_entity_1.UserEntity.findOneBy({ defixId: defixId });
                if (!user) {
                    return res.status(400).send({ message: "User not found." });
                }
                next();
            }
            catch (err) {
                res.status(500).send({ message: "Internal server error in Valid." });
            }
        });
    }
}
exports.SharedMiddleware = SharedMiddleware;
