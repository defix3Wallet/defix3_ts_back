"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapController = void 0;
const swap_service_1 = require("../services/swap.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
const email_shared_1 = require("../../../shared/email/email.shared");
const utils_shared_1 = require("../../../shared/utils/utils.shared");
class SwapController {
    constructor() {
        this.getPreviewSwap = async (req, res) => {
            try {
                const { fromCoin, toCoin, amount, blockchain, address } = req.body;
                if (!fromCoin || !toCoin || !amount || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const previewData = await this.swapService.getPreviewSwap(fromCoin, toCoin, amount, blockchain, address);
                res.send(previewData);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({ message: error.message });
            }
        };
        this.sendSwap = async (req, res) => {
            try {
                const { defixId, fromCoin, toCoin, pkEncrypt, priceRoute, blockchain, language } = req.body;
                let lang = language;
                if (lang !== "en" && lang !== "es") {
                    lang = "en";
                }
                if (!fromCoin || !toCoin || !defixId || !priceRoute || !pkEncrypt || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const privateKey = crypto_shared_1.CryptoShared.decrypt(pkEncrypt);
                if (!privateKey)
                    return res.status(400).send({ message: "privateKey invalid." });
                const address = await utils_shared_1.UtilsShared.getAddressUser(defixId, blockchain);
                if (!address)
                    return res.status(400).send({ message: "Address invalid." });
                const swapResult = await this.swapService.sendSwap(defixId, fromCoin, toCoin, priceRoute, privateKey, blockchain, address);
                this.mailService.emailSuccessSwap(defixId, fromCoin, swapResult.amount, toCoin, swapResult.destAmount, blockchain, swapResult.hash, swapResult.createdAt, lang);
                res.send(swapResult);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({ message: error.message });
            }
        };
        this.swapService = new swap_service_1.SwapService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.SwapController = SwapController;
