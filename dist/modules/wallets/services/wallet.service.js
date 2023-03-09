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
exports.WalletService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const user_service_1 = require("../../users/services/user.service");
const blockchain_1 = require("../../../blockchain");
const address_service_1 = require("../../address/services/address.service");
class WalletService {
    constructor() {
        this.createWalletDefix = (defixId, mnemonic) => __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = yield Promise.all([
                    blockchain_1.blockchain.btc.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.eth.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.bnb.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.near.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.trx.fromMnemonic(mnemonic),
                ]);
                const wallet = {
                    defixId: defixId,
                    credentials: credentials,
                };
                yield this.saveWalletDefix(mnemonic, wallet);
                return wallet;
            }
            catch (err) {
                console.log(err);
                throw new Error(`Failed to create wallet: ${err}`);
            }
        });
        this.importWalletDefix = (mnemonic) => __awaiter(this, void 0, void 0, function* () {
            try {
                const importId = yield utils_shared_1.UtilsShared.getIdNear(mnemonic);
                const user = yield this.userService.getUserByImportId(importId);
                if (!user)
                    throw new Error("Wallet does not exist in Defix3");
                const defixId = user.defix_id;
                // const walletNear = (
                //   await WalletEntity.findOneBy({
                //     user: { defix_id: user.defix_id },
                //     blockchain: "NEAR",
                //   })
                // )?.address;
                // if (!walletNear) throw new Error("Failed to import wallet.");
                const credentials = yield Promise.all([
                    blockchain_1.blockchain.btc.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.eth.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.bnb.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.near.fromMnemonic(mnemonic),
                    blockchain_1.blockchain.trx.fromMnemonic(mnemonic),
                ]);
                const wallet = {
                    defixId: defixId,
                    credentials: credentials,
                };
                this.validateWalletsUser(user, wallet);
                return wallet;
            }
            catch (err) {
                throw new Error(`Failed to import wallet: ${err}`);
            }
        });
        this.importFromPrivateKey = (privateKey) => __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = [];
                for (const service of Object.values(blockchain_1.blockchain)) {
                    const credential = yield service.fromPrivateKey(privateKey);
                    if (credential) {
                        credentials.push(credential);
                    }
                }
                if (credentials.length === 0)
                    throw new Error(`Failed private key`);
                const wallet = {
                    defixId: credentials[0].address,
                    credentials: credentials,
                };
                return wallet;
            }
            catch (err) {
                throw new Error(`Failed to import wallet: ${err}`);
            }
        });
        this.validateAddress = (address, coin) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (Object.keys(blockchain_1.blockchain).find((key) => key === coin.toLowerCase())) {
                    return blockchain_1.blockchain[coin.toLowerCase()].isAddress(address);
                }
                throw new Error(`Invalid coin`);
            }
            catch (err) {
                throw new Error(`Failed to validate address: ${err}`);
            }
        });
        /**
         * Utils for WalletService
         */
        this.saveWalletDefix = (mnemonic, wallet) => __awaiter(this, void 0, void 0, function* () {
            try {
                const importId = yield utils_shared_1.UtilsShared.getIdNear(mnemonic);
                const user = yield this.userService.createUser(wallet.defixId, importId);
                if (!user)
                    throw new Error("Wallet does not exist in Defix3");
                for (let credential of wallet.credentials) {
                    this.addressService.createAddress(user, credential.name, credential.address);
                }
                return user;
            }
            catch (err) {
                throw new Error(`Failed to save wallet addresses: ${err}`);
            }
        });
        this.validateWalletsUser = (user, wallet) => __awaiter(this, void 0, void 0, function* () {
            try {
                const walletsUser = yield this.addressService.getAddressesByDefixId(user.defix_id);
                for (let credential of wallet.credentials) {
                    if (!walletsUser.find((element) => element.blockchain === credential.name)) {
                        this.addressService.createAddress(user, credential.name, credential.address);
                    }
                }
            }
            catch (err) {
                throw new Error(`Failed to validate wallet address: ${err}`);
            }
        });
        this.userService = new user_service_1.UserService();
        this.addressService = new address_service_1.AddressService();
    }
}
exports.WalletService = WalletService;
