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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
const postgres_1 = __importDefault(require("../../../config/postgres"));
const utils_shared_1 = require("../../../shared/utils/utils.shared");
class GeneralService {
    constructor() {
        this.getCryptos = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield utils_shared_1.UtilsShared.getCryptos();
            }
            catch (err) {
                throw new Error(`Failed to get cryptos: ${err}`);
            }
        });
        this.getCryptosSwap = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const conexion = yield (0, postgres_1.default)();
                const cryptocurrencys = yield conexion.query("select * from backend_cryptocurrency where swap=true");
                const cryptos = [];
                for (let cryptocurrency of cryptocurrencys.rows) {
                    const tokens = yield conexion.query("select * from backend_token where cryptocurrency_id = $1", [cryptocurrency.id]);
                    cryptocurrency.tokens = tokens.rows;
                    cryptos.push(cryptocurrency);
                }
                return cryptos;
            }
            catch (err) {
                throw new Error(`Failed to get cryptos: ${err}`);
            }
        });
    }
}
exports.GeneralService = GeneralService;
