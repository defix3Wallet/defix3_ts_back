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
exports.TwoFAController = void 0;
const twoFA_service_1 = require("../services/twoFA.service");
class TwoFAController {
    constructor() {
        this.generateTwoFA = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId } = req.body;
                const response = yield this.twoFAService.generateTwoFA(defixId);
                return res.send(response);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.activateTwoFA = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, code2fa } = req.body;
                if (!code2fa)
                    return res.status(400).send({ message: "Invalid data." });
                yield this.twoFAService.activateTwoFA(defixId, code2fa);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.deactivateTwoFA = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId, code2fa } = req.body;
                if (!code2fa)
                    return res.status(400).send({ message: "Invalid data." });
                yield this.twoFAService.deactivateTwoFA(defixId, code2fa);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.statusTwoFA = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId } = req.body;
                const response = yield this.twoFAService.statusTwoFA(defixId);
                return res.send(response);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.twoFAService = new twoFA_service_1.TwoFAService();
    }
}
exports.TwoFAController = TwoFAController;
