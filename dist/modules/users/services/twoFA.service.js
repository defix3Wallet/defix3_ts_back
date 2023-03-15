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
exports.TwoFAService = void 0;
const user_service_1 = require("./user.service");
const otplib_1 = require("otplib");
class TwoFAService extends user_service_1.UserService {
    constructor() {
        super();
        this.generateTwoFA = (defixId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                // if (user.twofa) throw new Error(`2fa is already active.`);
                let secret;
                if (!user.secret) {
                    secret = otplib_1.authenticator.generateSecret();
                    const userUpdated = yield this.updateUser(defixId, { secret });
                    if (userUpdated.affected === 0)
                        throw new Error(`Failed to update user.`);
                }
                else {
                    secret = user.secret;
                }
                const codeAuth = otplib_1.authenticator.keyuri(defixId, "Defix3 App", secret);
                // const qr = await QRCode.toDataURL(codigo);
                return { codeAuth, secret };
            }
            catch (err) {
                throw new Error(`Failed to generate 2fa, ${err}`);
            }
        });
        this.activateTwoFA = (defixId, code2fa) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                if (!user.secret)
                    throw new Error(`The user does not have the secret.`);
                const auth = otplib_1.authenticator.check(code2fa, user.secret);
                if (!auth)
                    throw new Error(`Error code 2fa.`);
                const userUpdated = yield this.updateUser(defixId, { twofa: true });
                if (userUpdated.affected === 0)
                    throw new Error(`Failed to update user.`);
                return;
            }
            catch (err) {
                throw new Error(`Failed to activate 2fa, ${err}`);
            }
        });
        this.deactivateTwoFA = (defixId, code2fa) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                if (!user.secret)
                    throw new Error(`The user does not have the secret.`);
                const auth = otplib_1.authenticator.check(code2fa, user.secret);
                if (!auth)
                    throw new Error(`Error code 2fa.`);
                const userUpdated = yield this.updateUser(defixId, {
                    twofa: false,
                    secret: null,
                });
                if (userUpdated.affected === 0)
                    throw new Error(`Failed to update user.`);
                return;
            }
            catch (err) {
                throw new Error(`Failed to generate 2fa, ${err}`);
            }
        });
        this.statusTwoFA = (defixId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                return user.twofa;
            }
            catch (err) {
                throw new Error(`Failed to generate 2fa, ${err}`);
            }
        });
    }
}
exports.TwoFAService = TwoFAService;
