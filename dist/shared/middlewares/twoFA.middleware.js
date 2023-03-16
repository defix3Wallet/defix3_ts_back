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
exports.TwoFAMiddleware = void 0;
const twoFA_service_1 = require("../../modules/users/services/twoFA.service");
class TwoFAMiddleware {
    constructor() {
        this.validateTwoFA = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, code2fa } = req.body;
                if (defixId && !defixId.includes(".defix3")) {
                    return next();
                }
                const user = yield this.twoFAService.getUserByDefixId(defixId);
                if (!user)
                    return res.status(404).send({ message: `User not exists.` });
                if (!user.twofa)
                    return next;
                if (!code2fa)
                    return res
                        .status(404)
                        .send({ message: `Invalid data, Error: code2fa.` });
                const auth = yield this.twoFAService.checkTwoFA(code2fa, user.secret);
                if (!auth)
                    return res.status(401).send({ message: "code 2fa invalid" });
                return next();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.twoFAService = new twoFA_service_1.TwoFAService();
    }
}
exports.TwoFAMiddleware = TwoFAMiddleware;
