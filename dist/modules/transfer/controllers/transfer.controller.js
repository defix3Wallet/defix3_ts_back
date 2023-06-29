"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferController = void 0;
const transfer_service_1 = require("../services/transfer.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
const email_shared_1 = require("../../../shared/email/email.shared");
class TransferController {
    constructor() {
        this.getFeeTransfer = async (req, res) => {
            try {
                const { coin, blockchain, amount, address } = req.body;
                if (!coin || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const previewData = await this.transferService.getFeeTransfer(coin, blockchain, amount, address);
                res.send(previewData);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.sendTransfer = async (req, res) => {
            try {
                const { defixId, pkEncrypt, toAddress, coin, amount, blockchain, language } = req.body;
                let lang = language;
                if (lang !== "en" && lang !== "es") {
                    lang = "en";
                }
                if (!defixId || !pkEncrypt || !toAddress || !coin || !amount || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const privateKey = crypto_shared_1.CryptoShared.decrypt(pkEncrypt);
                if (!privateKey)
                    return res.status(400).send({ message: "privateKey invalid." });
                const transaction = await this.transferService.sendTransfer(defixId, privateKey, toAddress, coin, amount, blockchain);
                this.mailService.emailSuccessWithdrawal(defixId, toAddress, amount, coin, blockchain, transaction.hash, lang);
                this.mailService.emailReceivedPayment(defixId, toAddress, amount, coin, blockchain, transaction.hash, lang);
                res.send(transaction);
            }
            catch (error) {
                console.log(error.message);
                return res.status(500).send({ message: error.message });
            }
        };
        this.transferService = new transfer_service_1.TransferService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.TransferController = TransferController;
