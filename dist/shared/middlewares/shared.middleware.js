"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedMiddleware = void 0;
const user_entity_1 = require("../../modules/users/entities/user.entity");
class SharedMiddleware {
    async defixIdAvailable(req, res, next) {
        try {
            const { defixId } = req.body;
            if (!defixId || !defixId.includes(".defix3") || defixId.includes(" "))
                return res.status(400).send({ message: "Error DefixId." });
            const user = await user_entity_1.UserEntity.findOneBy({ defixId: defixId });
            if (user) {
                return res.status(400).send({ message: "User already exists." });
            }
            next();
        }
        catch (err) {
            res.status(500).send({ message: "Internal server error." });
        }
    }
    async defixIdValid(req, res, next) {
        try {
            const { defixId } = req.body;
            console.log(defixId);
            if (!defixId || !defixId.includes(".defix3") || defixId.includes(" "))
                return res.status(400).send({ message: "Error DefixId." });
            const user = await user_entity_1.UserEntity.findOneBy({ defixId: defixId });
            if (!user) {
                return res.status(400).send({ message: "User not found." });
            }
            next();
        }
        catch (err) {
            res.status(500).send({ message: "Internal server error in Valid." });
        }
    }
}
exports.SharedMiddleware = SharedMiddleware;
