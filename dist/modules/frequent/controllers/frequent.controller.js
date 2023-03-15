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
exports.FrequentController = void 0;
const frequent_service_1 = require("../services/frequent.service");
class FrequentController {
    constructor() {
        this.getAllFrequent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { defixId } = req.body;
                const frequentAll = this.frequentService.getAllFrequentByDefixId(defixId);
                return res.send(frequentAll);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.deleteFrequent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const resultDelete = yield this.frequentService.deleteFrequentById(id);
                if (resultDelete.affected === 0)
                    return res.status(400).send({ message: "Frequent not found" });
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        });
        this.frequentService = new frequent_service_1.FrequentService();
    }
}
exports.FrequentController = FrequentController;
