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
exports.WalletController = void 0;
const wallet_service_1 = require("../services/wallet.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const email_shared_1 = require("../../../shared/email/email.shared");
class WalletController {
    constructor() {
        this.createWalletDefix = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, seedPhrase, email } = req.body;
                if (!defixId || !seedPhrase)
                    return res.status(400).send({ message: "Invalid data." });
                const mnemonic = crypto_shared_1.CryptoShared.decrypt(seedPhrase);
                // const mnemonic = seedPhrase;
                if (!mnemonic)
                    return res.status(400).send({ message: "Seed Phrase invalid." });
                const defixID = defixId.toLowerCase();
                const wallet = yield this.walletService.createWalletDefix(defixID, mnemonic);
                if (!wallet)
                    return res.status(400).send({ message: "Internal server error." });
                if (yield utils_shared_1.UtilsShared.validateEmail(email)) {
                    this.mailService.sendMailPhrase(mnemonic, defixID, email);
                }
                return res.send(wallet);
            }
            catch (err) {
                console.log(err);
                return res.status(500).send({ message: "Internal server error." });
            }
        });
        this.importWalletDefix = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { seedPhrase } = req.body;
                if (!seedPhrase)
                    return res.status(400).send({ message: "Invalid data." });
                const mnemonic = crypto_shared_1.CryptoShared.decrypt(seedPhrase);
                // const mnemonic = seedPhrase;
                if (!mnemonic)
                    return res.status(400).send({ message: "Seed Phrase invalid." });
                const wallet = yield this.walletService.importWalletDefix(mnemonic);
                return res.send(wallet);
            }
            catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .send({ message: "Internal server error.", error: err });
            }
        });
        this.importFromPrivateKey = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { pkEncript } = req.body;
                if (!pkEncript)
                    return res.status(400).send({ message: "Invalid data." });
                const privateKey = crypto_shared_1.CryptoShared.decrypt(pkEncript);
                // const privateKey = pkEncript;
                if (!privateKey)
                    return res.status(400).send({ message: "Invalid data." });
                const wallet = yield this.walletService.importFromPrivateKey(privateKey);
                return res.send(wallet);
            }
            catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .send({ message: "Internal server error.", error: err });
            }
        });
        this.validateAddress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, blockchain } = req.body;
                if (!address || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                res.send(yield this.walletService.validateAddress(address, blockchain));
            }
            catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .send({ message: "Internal server error.", error: err });
            }
        });
        this.walletService = new wallet_service_1.WalletService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.WalletController = WalletController;
