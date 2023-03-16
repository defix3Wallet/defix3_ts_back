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
exports.UserService = void 0;
const user_entity_1 = require("../entities/user.entity");
class UserService {
    constructor() {
        this.createUser = (defixId, importId, email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_entity_1.UserEntity();
                user.defixId = defixId;
                user.importId = importId;
                email ? (user.email = email) : undefined;
                const userSaved = yield user.save();
                return userSaved;
            }
            catch (err) {
                throw new Error(`Failed to create user: ${err}`);
            }
        });
        this.getUserByImportId = (importId) => __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.UserEntity.findOneBy({ importId });
        });
        this.getUserByDefixId = (defixId) => __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.UserEntity.findOneBy({ defixId });
        });
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.UserEntity.find({ select: ["defixId", "id"] });
        });
        this.getUserDataByDefixId = (defixId) => __awaiter(this, void 0, void 0, function* () {
            const userData = yield user_entity_1.UserEntity.createQueryBuilder("user")
                .select([
                "user.defixId",
                "user.email",
                "user.flagSend",
                "user.flagReceive",
                "user.flagDex",
                "user.flagFiat",
                "user.name",
                "user.lastname",
                "user.legalDocument",
                "user.typeDocument",
                "user.twofa",
                "user.closeSessions",
            ])
                .where("user.defixId = :defixId", { defixId: defixId })
                .getOne();
            return userData;
        });
        this.updateUser = (defixId, body) => __awaiter(this, void 0, void 0, function* () {
            const result = yield user_entity_1.UserEntity.update({ defixId: defixId }, body);
            if (result.affected === 0)
                throw new Error(`Failed to updated user.`);
            return result;
        });
    }
}
exports.UserService = UserService;
