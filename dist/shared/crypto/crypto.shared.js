"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoShared = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CryptoShared {
    static decrypt(text) {
        try {
            // return text;
            const cipheredBytes = Buffer.from(text, "base64");
            const decoded = crypto_1.default
                .privateDecrypt({
                key: process.env.PRIVATE_KEY,
                passphrase: process.env.PASSWORD_DB,
                padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            }, cipheredBytes)
                .toString();
            return decoded;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    static encrypt(text) {
        try {
            const encrypted = crypto_1.default.publicEncrypt({
                key: process.env.PUBLIC_KEY,
                padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            }, Buffer.from(text));
            return encrypted.toString("base64");
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
exports.CryptoShared = CryptoShared;
