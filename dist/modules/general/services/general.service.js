"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
const postgres_1 = __importDefault(require("../../../config/postgres"));
const utils_shared_1 = require("../../../shared/utils/utils.shared");
class GeneralService {
    constructor() {
        this.getCryptos = async () => {
            try {
                return await utils_shared_1.UtilsShared.getCryptos();
            }
            catch (err) {
                throw new Error(`Failed to get cryptos: ${err}`);
            }
        };
        this.getCryptosSwap = async () => {
            try {
                const conexion = await (0, postgres_1.default)();
                const cryptocurrencys = await conexion.query("select * from backend_cryptocurrency where swap=true");
                const cryptos = [];
                for (let cryptocurrency of cryptocurrencys.rows) {
                    const tokens = await conexion.query("select * from backend_token where cryptocurrency_id = $1", [cryptocurrency.id]);
                    cryptocurrency.tokens = tokens.rows;
                    cryptos.push(cryptocurrency);
                }
                return cryptos;
            }
            catch (err) {
                throw new Error(`Failed to get cryptos: ${err}`);
            }
        };
        this.getCryptosLimit = async () => {
            try {
                const conexion = await (0, postgres_1.default)();
                const cryptocurrencys = await conexion.query("select * from backend_cryptocurrency where limit_order=true");
                const cryptos = [];
                for (let cryptocurrency of cryptocurrencys.rows) {
                    const tokens = await conexion.query("select * from backend_token where cryptocurrency_id = $1", [cryptocurrency.id]);
                    cryptocurrency.tokens = tokens.rows;
                    cryptos.push(cryptocurrency);
                }
                return cryptos;
            }
            catch (err) {
                throw new Error(`Failed to get cryptos: ${err}`);
            }
        };
    }
}
exports.GeneralService = GeneralService;
