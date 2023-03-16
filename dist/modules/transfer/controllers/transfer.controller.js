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
exports.TransferController = void 0;
const transfer_service_1 = require("../services/transfer.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
const email_shared_1 = require("../../../shared/email/email.shared");
class TransferController {
    constructor() {
        // public getTransferFee = async (req: Request, res: Response) => {
        //   try {
        //     const { defixId, toDefix, coin, amount, blockchain } =
        //       req.body;
        //     if (!defixId || !toDefix || !coin || !amount || !blockchain)
        //       return res.status(400).send({ message: "Invalid data." });
        //     const transaction = await this.transferService.sendTransfer(
        //       defixId,
        //       privateKey,
        //       toDefix,
        //       coin,
        //       amount,
        //       blockchain
        //     );
        //     res.send(transaction);
        //   } catch (error: any) {
        //     return res.status(500).send({ message: error.message });
        //   }
        // };
        this.sendTransfer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, pkEncrypt, toDefix, coin, amount, blockchain } = req.body;
                console.log(defixId, pkEncrypt, toDefix, coin, amount, blockchain);
                if (!defixId || !pkEncrypt || !toDefix || !coin || !amount || !blockchain)
                    return res.status(400).send({ message: "Invalid data." });
                const privateKey = crypto_shared_1.CryptoShared.decrypt(pkEncrypt);
                if (!privateKey)
                    return res.status(400).send({ message: "privateKey invalid." });
                const transaction = yield this.transferService.sendTransfer(defixId, privateKey, toDefix, coin, amount, blockchain);
                this.mailService.sendMail(defixId, toDefix, "envio", {
                    monto: amount,
                    moneda: coin,
                    receptor: toDefix,
                    emisor: defixId,
                    tipoEnvio: toDefix.includes(".defix3") ? "user" : "wallet",
                });
                res.send(transaction);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.transferService = new transfer_service_1.TransferService();
        this.mailService = new email_shared_1.MailShared();
    }
}
exports.TransferController = TransferController;
