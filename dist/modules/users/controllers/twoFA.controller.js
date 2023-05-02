"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFAController = void 0;
const twoFA_service_1 = require("../services/twoFA.service");
class TwoFAController {
    constructor() {
        this.generateTwoFA = async (req, res) => {
            try {
                const { defixId } = req.body;
                const response = await this.twoFAService.generateTwoFA(defixId);
                return res.send(response);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.activateTwoFA = async (req, res) => {
            try {
                const { defixId, code2fa } = req.body;
                if (!code2fa)
                    return res.status(400).send({ message: "Invalid data." });
                await this.twoFAService.activateTwoFA(defixId, code2fa);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.deactivateTwoFA = async (req, res) => {
            try {
                const { defixId, code2fa } = req.body;
                if (!code2fa)
                    return res.status(400).send({ message: "Invalid data." });
                await this.twoFAService.deactivateTwoFA(defixId, code2fa);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.statusTwoFA = async (req, res) => {
            try {
                const { defixId } = req.body;
                const response = await this.twoFAService.statusTwoFA(defixId);
                return res.send(response);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.twoFAService = new twoFA_service_1.TwoFAService();
    }
}
exports.TwoFAController = TwoFAController;
