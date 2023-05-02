"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFAMiddleware = void 0;
const twoFA_service_1 = require("../../modules/users/services/twoFA.service");
class TwoFAMiddleware {
    constructor() {
        this.validateTwoFA = async (req, res, next) => {
            try {
                const { defixId, code2fa } = req.body;
                if (defixId && !defixId.includes(".defix3")) {
                    return next();
                }
                const user = await this.twoFAService.getUserByDefixId(defixId);
                if (!user)
                    return res.status(404).send({ message: `User not exists.` });
                if (!user.twofa)
                    return next();
                if (!code2fa)
                    return res.status(404).send({ message: `Invalid data, Error: code2fa.` });
                const auth = await this.twoFAService.checkTwoFA(code2fa, user.secret);
                if (!auth)
                    return res.status(401).send({ message: "code 2fa invalid" });
                return next();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.twoFAService = new twoFA_service_1.TwoFAService();
    }
}
exports.TwoFAMiddleware = TwoFAMiddleware;
