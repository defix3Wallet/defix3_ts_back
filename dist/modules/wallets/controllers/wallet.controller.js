"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("../services/wallet.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const email_shared_1 = require("../../../shared/email/email.shared");
class WalletController {
    constructor() {
        this.createWalletDefix = async (req, res) => {
            try {
                const { defixId, seedPhrase, email, language } = req.body;
                let lang = language;
                if (!defixId || !seedPhrase)
                    return res.status(400).send({ message: "Invalid data." });
                const mnemonic = crypto_shared_1.CryptoShared.decrypt(seedPhrase);
                if (!mnemonic)
                    return res.status(400).send({ message: "Seed Phrase invalid." });
                if (lang !== "en" && lang !== "es") {
                    lang = "en";
                }
                const defixID = defixId.toLowerCase();
                const wallet = await this.walletService.createWalletDefix(defixID, mnemonic, lang);
                if (!wallet)
                    return res.status(400).send({ message: "Internal server error." });
                if (await utils_shared_1.UtilsShared.validateEmail(email)) {
                    this.mailService.sendMailPhrase(mnemonic, defixID, email, lang);
                }
                return res.send(wallet);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.importWalletDefix = async (req, res) => {
            try {
                const { seedPhrase, language } = req.body;
                let lang = language;
                if (lang !== "en" && lang !== "es") {
                    lang = "en";
                }
                if (!seedPhrase)
                    return res.status(400).send({ message: "Invalid data." });
                const mnemonic = crypto_shared_1.CryptoShared.decrypt(seedPhrase);
                if (!mnemonic)
                    return res.status(400).send({ message: "Seed Phrase invalid." });
                const wallet = await this.walletService.importWalletDefix(mnemonic, lang);
                return res.send(wallet);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.importFromPrivateKey = async (req, res) => {
            try {
                const { pkEncrypt } = req.body;
                if (!pkEncrypt)
                    return res.status(400).send({ message: "Invalid data." });
                const privateKey = crypto_shared_1.CryptoShared.decrypt(pkEncrypt);
                if (!privateKey)
                    return res.status(400).send({ message: "Invalid data." });
                const wallet = await this.walletService.importFromPrivateKey(privateKey);
                return res.send(wallet);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.validateAddress = async (req, res) => {
            try {
                const { address, blockchain } = req.body;
                if (!address || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                res.send(await this.walletService.validateAddress(address, blockchain));
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.importFromJson = async (req, res) => {
            try {
                const { data } = req.body;
                if (!data)
                    return res.status(400).send({ message: "Invalid data." });
                const { ciphertext, typeLog, dateTime } = JSON.parse(data);
                if (!ciphertext || !typeLog || !dateTime)
                    return res.status(400).send({ message: "Invalid variables." });
                const dataImport = {
                    ciphertext,
                    typeLog,
                    dateTime,
                };
                const wallet = await this.walletService.importFromJson(dataImport);
                return res.send(wallet);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.exportWalletJson = async (req, res) => {
            try {
                const { ciphertext, typeLog } = req.body;
                const ciphertextMain = crypto_shared_1.CryptoShared.decrypt(ciphertext);
                if (!ciphertextMain)
                    return res.status(400).send({ message: "Invalid data." });
                if (!ciphertextMain && (typeLog !== "MNEMONIC" || typeLog !== "PRIVATE_KEY"))
                    return res.status(400).send({ message: "Invalid data." });
                res.send(JSON.stringify(await this.walletService.exportWalletJson(ciphertextMain, typeLog)));
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.walletService = new wallet_service_1.WalletService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.WalletController = WalletController;
