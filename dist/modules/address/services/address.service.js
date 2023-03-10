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
exports.AddressService = void 0;
const address_entity_1 = require("../entities/address.entity");
class AddressService {
    constructor() {
        this.createAddress = (user, blockchain, address) => __awaiter(this, void 0, void 0, function* () {
            try {
                const walletAddress = new address_entity_1.AddressEntity();
                walletAddress.user = user;
                walletAddress.blockchain = blockchain;
                walletAddress.address = address;
                return yield walletAddress.save();
            }
            catch (err) {
                throw new Error(`Failed to create address: ${err}`);
            }
        });
        this.getAddressByDefixId = (defixId, blockchain) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield address_entity_1.AddressEntity.findOneBy({
                    user: { defixId: defixId },
                    blockchain,
                });
            }
            catch (err) {
                throw new Error(`Failed to get address: ${err}`);
            }
        });
        this.getAddressesByDefixId = (defixId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield address_entity_1.AddressEntity.findBy({
                    user: { defixId: defixId },
                });
            }
            catch (err) {
                throw new Error(`Failed to get addresses: ${err}`);
            }
        });
    }
}
exports.AddressService = AddressService;
