"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralController = void 0;
const general_service_1 = require("../services/general.service");
class GeneralController {
    constructor() {
        this.getCryptos = async (req, res) => {
            try {
                const cryptos = await this.generalService.getCryptos();
                res.send(cryptos);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.getCryptosSwap = async (req, res) => {
            try {
                const cryptos = await this.generalService.getCryptosSwap();
                res.send(cryptos);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.getCryptosLimit = async (req, res) => {
            try {
                const cryptos = await this.generalService.getCryptosLimit();
                res.send(cryptos);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.getCryptosBridge = async (req, res) => {
            try {
                const cryptos = await this.generalService.getCryptosBridge();
                res.send(cryptos);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.generalService = new general_service_1.GeneralService();
    }
}
exports.GeneralController = GeneralController;
