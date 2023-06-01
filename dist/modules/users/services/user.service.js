"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_entity_1 = require("../entities/user.entity");
class UserService {
    constructor() {
        this.createUser = async (defixId, importId, email) => {
            try {
                const user = new user_entity_1.UserEntity();
                user.defixId = defixId;
                user.importId = importId;
                email ? (user.email = email) : undefined;
                const userSaved = await user.save();
                return userSaved;
            }
            catch (err) {
                throw new Error(`Failed to create user: ${err}`);
            }
        };
        this.getUserByImportId = async (importId) => {
            return await user_entity_1.UserEntity.findOneBy({ importId });
        };
        this.getUserByDefixId = async (defixId) => {
            return await user_entity_1.UserEntity.findOneBy({ defixId });
        };
        this.getUserByEmail = async (email) => {
            return await user_entity_1.UserEntity.findOneBy({ email });
        };
        this.getUsers = async () => {
            return await user_entity_1.UserEntity.find({ select: ["defixId", "id"] });
        };
        this.getUserDataByDefixId = async (defixId) => {
            const userData = await user_entity_1.UserEntity.createQueryBuilder("user")
                .select([
                "user.defixId",
                "user.email",
                "user.flagNews",
                "user.flagDeposit",
                "user.flagWithdraw",
                "user.flagSign",
                "user.flagEvolution",
                "user.name",
                "user.lastname",
                "user.avatar",
                "user.legalDocument",
                "user.typeDocument",
                "user.closeSessions",
            ])
                .where("user.defixId = :defixId", { defixId: defixId })
                .getOne();
            return userData;
        };
        this.updateUser = async (defixId, body) => {
            const result = await user_entity_1.UserEntity.update({ defixId: defixId }, body);
            if (result.affected === 0)
                throw new Error(`Failed to updated user.`);
            return result;
        };
    }
}
exports.UserService = UserService;
