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
exports.SwapController = void 0;
const swap_service_1 = require("../services/swap.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
const email_shared_1 = require("../../../shared/email/email.shared");
const utils_shared_1 = require("../../../shared/utils/utils.shared");
class SwapController {
    constructor() {
        this.getPreviewSwap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { fromCoin, toCoin, amount, blockchain, address } = req.body;
                if (!fromCoin || !toCoin || !amount || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const previewData = yield this.swapService.getPreviewSwap(fromCoin, toCoin, amount, blockchain, address);
                res.send(previewData);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.sendSwap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, fromCoin, toCoin, pkEncrypt, priceRoute, blockchain } = req.body;
                if (!fromCoin ||
                    !toCoin ||
                    !defixId ||
                    !priceRoute ||
                    !pkEncrypt ||
                    !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const privateKey = crypto_shared_1.CryptoShared.decrypt(pkEncrypt);
                if (!privateKey)
                    return res.status(400).send({ message: "privateKey invalid." });
                const address = yield utils_shared_1.UtilsShared.getAddressUser(defixId, blockchain);
                if (!address)
                    return res.status(400).send({ message: "Address invalid." });
                const swapResult = yield this.swapService.sendSwap(defixId, fromCoin, toCoin, priceRoute, privateKey, blockchain, address);
                res.send(swapResult);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.swapService = new swap_service_1.SwapService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.SwapController = SwapController;
