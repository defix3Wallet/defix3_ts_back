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
exports.GeneralController = void 0;
const general_service_1 = require("../services/general.service");
class GeneralController {
    constructor() {
        this.getCryptos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cryptos = yield this.generalService.getCryptos();
                res.send(cryptos);
            }
            catch (error) {
                return res.status(500).send({ message: error });
            }
        });
        this.getCryptosSwap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cryptos = yield this.generalService.getCryptosSwap();
                res.send(cryptos);
            }
            catch (error) {
                return res.status(500).send({ message: error });
            }
        });
        this.generalService = new general_service_1.GeneralService();
    }
}
exports.GeneralController = GeneralController;
