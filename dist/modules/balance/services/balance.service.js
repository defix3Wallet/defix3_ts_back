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
exports.BalanceService = void 0;
const blockchain_1 = require("../../../blockchain");
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const address_service_1 = require("../../address/services/address.service");
class BalanceService {
    constructor() {
        this.getBalance = (defixId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const addresses = yield this.addressService.getAddressesByDefixId(defixId);
                const balances = [];
                const cryptos = yield utils_shared_1.UtilsShared.getCryptos();
                for (let crypto of cryptos) {
                    console.log(crypto);
                    const balanceCrypto = {
                        coin: crypto.coin,
                        blockchain: crypto.blockchain,
                        icon: crypto.icon,
                        balance: 0,
                        tokens: [],
                    };
                    const addressItem = addresses.find((element) => element.blockchain === crypto.coin);
                    if (!addressItem)
                        throw new Error(`Failed to get balance`);
                    const address = addressItem.address || "";
                    balanceCrypto.balance = yield blockchain_1.blockchainService[crypto.coin.toLowerCase()].getBalance(address);
                    for (let token of crypto.tokens) {
                        const itemToken = {
                            coin: token.coin,
                            balance: 0,
                            icon: token.icon,
                        };
                        itemToken.balance = yield blockchain_1.blockchainService[crypto.coin.toLowerCase()].getBalanceToken(address, token.contract, token.decimals);
                        balanceCrypto.tokens.push(itemToken);
                    }
                    balances.push(balanceCrypto);
                }
                return balances;
            }
            catch (err) {
                throw new Error(`Failed to get address: ${err}`);
            }
        });
        this.addressService = new address_service_1.AddressService();
    }
}
exports.BalanceService = BalanceService;
