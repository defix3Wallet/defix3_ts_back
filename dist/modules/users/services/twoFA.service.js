"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFAService = void 0;
const user_service_1 = require("./user.service");
const otplib_1 = require("otplib");
const qrcode_1 = __importDefault(require("qrcode"));
class TwoFAService extends user_service_1.UserService {
    constructor() {
        super();
        this.generateTwoFA = async (defixId) => {
            try {
                const user = await this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                // if (user.twofa) throw new Error(`2fa is already active.`);
                let secret;
                if (!user.secret) {
                    secret = otplib_1.authenticator.generateSecret();
                    const userUpdated = await this.updateUser(defixId, { secret });
                    if (userUpdated.affected === 0)
                        throw new Error(`Failed to update user.`);
                }
                else {
                    secret = user.secret;
                }
                const codeAuth = otplib_1.authenticator.keyuri(defixId, "Defix3 App", secret);
                // const qr = await QRCode.toDataURL(codigo);
                console.log("QR", await qrcode_1.default.toDataURL(codeAuth));
                return { codeAuth, secret };
            }
            catch (err) {
                throw new Error(`Failed to generate 2fa, ${err}`);
            }
        };
        this.activateTwoFA = async (defixId, code2fa) => {
            try {
                const user = await this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                if (!user.secret)
                    throw new Error(`The user does not have the secret.`);
                const auth = otplib_1.authenticator.check(code2fa, user.secret);
                if (!auth)
                    throw new Error(`Error code 2fa.`);
                const userUpdated = await this.updateUser(defixId, { twofa: true });
                if (userUpdated.affected === 0)
                    throw new Error(`Failed to update user.`);
                return;
            }
            catch (err) {
                throw new Error(`Failed to activate 2fa, ${err}`);
            }
        };
        this.deactivateTwoFA = async (defixId, code2fa) => {
            try {
                const user = await this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                if (!user.secret)
                    throw new Error(`The user does not have the secret.`);
                const auth = otplib_1.authenticator.check(code2fa, user.secret);
                if (!auth)
                    throw new Error(`Error code 2fa.`);
                const userUpdated = await this.updateUser(defixId, {
                    twofa: false,
                    secret: null,
                });
                if (userUpdated.affected === 0)
                    throw new Error(`Failed to update user.`);
                return;
            }
            catch (err) {
                throw new Error(`Failed to deactivate 2fa, ${err}`);
            }
        };
        this.checkTwoFA = async (code2fa, secret) => {
            try {
                const auth = otplib_1.authenticator.check(code2fa, secret);
                return auth;
            }
            catch (err) {
                throw new Error(`Failed to validate 2fa, ${err}`);
            }
        };
        this.statusTwoFA = async (defixId) => {
            try {
                const user = await this.getUserByDefixId(defixId);
                if (!user)
                    throw new Error(`User not exists.`);
                return user.twofa;
            }
            catch (err) {
                throw new Error(`Failed to generate 2fa, ${err}`);
            }
        };
    }
}
exports.TwoFAService = TwoFAService;
