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
exports.FrequentService = void 0;
const user_service_1 = require("../../users/services/user.service");
const frequent_entity_1 = require("../entities/frequent.entity");
class FrequentService extends user_service_1.UserService {
    constructor() {
        super(...arguments);
        this.createFrequent = (user, frequentUser) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userFrequent = yield this.getFrequentByDefixId(user, frequentUser);
                if (userFrequent)
                    throw new Error(`User frequent already exists.`);
                const userDefix = yield this.getUserByDefixId(user);
                if (!userDefix)
                    throw new Error(`User does not exists.`);
                const frequent = new frequent_entity_1.FrequentEntity();
                frequent.user = userDefix;
                frequent.frequentUser = frequentUser;
                return yield frequent.save();
            }
            catch (err) {
                console.log(`Failed to create frequent user: ${err.message}`);
                return;
                // throw new Error(`Failed to create frequent user: ${err.message}`);
            }
        });
        this.getFrequentByDefixId = (defixId, frequentUser) => __awaiter(this, void 0, void 0, function* () {
            try {
                const frequent = yield frequent_entity_1.FrequentEntity.findOneBy({
                    user: { defixId },
                    frequentUser,
                });
                return frequent;
            }
            catch (err) {
                throw new Error(`Failed to get address: ${err}`);
            }
        });
        this.getAllFrequentByDefixId = (defixId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const frequentAll = yield frequent_entity_1.FrequentEntity.find({
                    where: { user: { defixId: defixId } },
                });
                return frequentAll;
            }
            catch (err) {
                throw new Error(`Failed to get address: ${err}`);
            }
        });
        this.deleteFrequentById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield frequent_entity_1.FrequentEntity.delete({ id });
            }
            catch (err) {
                throw new Error(`Failed to get address: ${err}`);
            }
        });
    }
}
exports.FrequentService = FrequentService;
