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
const email_shared_1 = require("../../../shared/email/email.shared");
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
        this.swapService = new swap_service_1.SwapService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.SwapController = SwapController;
