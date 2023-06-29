"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const utils_shared_1 = require("../../../shared/utils/utils.shared");
const user_service_1 = require("../../users/services/user.service");
const blockchain_1 = require("../../../blockchain");
const address_service_1 = require("../../address/services/address.service");
const crypto_shared_1 = require("../../../shared/crypto/crypto.shared");
class WalletService {
    constructor() {
        this.createWalletDefix = async (defixId, mnemonic, language = "en") => {
            try {
                const credentials = [];
                for (const service of Object.values(blockchain_1.blockchainService)) {
                    credentials.push(await service.fromMnemonic(mnemonic));
                }
                const wallet = {
                    defixId: defixId,
                    credentials: credentials,
                };
                await this.saveWalletDefix(mnemonic, wallet, language);
                return wallet;
            }
            catch (err) {
                console.log(err);
                throw new Error(`Failed to create wallet: ${err}`);
            }
        };
        this.importWalletDefix = async (mnemonic, language) => {
            try {
                const importId = await utils_shared_1.UtilsShared.getIdNear(mnemonic);
                const user = await this.userService.getUserByImportId(importId);
                if (!user)
                    throw new Error("Wallet does not exist in Defix3");
                const defixId = user.defixId;
                const credentials = [];
                for (const service of Object.values(blockchain_1.blockchainService)) {
                    credentials.push(await service.fromMnemonic(mnemonic));
                }
                const wallet = {
                    defixId: defixId,
                    credentials: credentials,
                };
                this.validateWalletsUser(user, wallet);
                await this.userService.updateUser(user.defixId, { language: language || user.language });
                return wallet;
            }
            catch (err) {
                throw new Error(`Failed to import wallet: ${err}`);
            }
        };
        this.importFromPrivateKey = async (privateKey) => {
            try {
                const credentials = [];
                for (const service of Object.values(blockchain_1.blockchainService)) {
                    const credential = await service.fromPrivateKey(privateKey);
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
        };
        this.importFromJson = async (dataImport) => {
            try {
                const credentials = [];
                let defixId;
                if (crypto_shared_1.CryptoShared.decryptAES(dataImport.typeLog) === "MNEMONIC") {
                    const mnemonic = crypto_shared_1.CryptoShared.decryptAES(dataImport.ciphertext);
                    const importId = await utils_shared_1.UtilsShared.getIdNear(mnemonic);
                    const user = await this.userService.getUserByImportId(importId);
                    if (!user)
                        throw new Error("Wallet does not exist in Defix3");
                    defixId = user.defixId;
                    for (const service of Object.values(blockchain_1.blockchainService)) {
                        credentials.push(await service.fromMnemonic(mnemonic));
                    }
                }
                else if (crypto_shared_1.CryptoShared.decryptAES(dataImport.typeLog) === "PRIVATE_KEY") {
                    for (const service of Object.values(blockchain_1.blockchainService)) {
                        const credential = await service.fromPrivateKey(crypto_shared_1.CryptoShared.decryptAES(dataImport.ciphertext));
                        if (credential) {
                            credentials.push(credential);
                        }
                    }
                    defixId = credentials[0].address;
                }
                else {
                    throw new Error(`Invalid mnemonic and private key`);
                }
                const wallet = {
                    defixId: defixId,
                    credentials: credentials,
                };
                return wallet;
            }
            catch (err) {
                throw new Error(`Failed to export wallet: ${err}`);
            }
        };
        this.exportWalletJson = async (ciphertext, typeLog) => {
            try {
                const data = {
                    ciphertext: crypto_shared_1.CryptoShared.encryptAES(ciphertext),
                    typeLog: crypto_shared_1.CryptoShared.encryptAES(typeLog),
                    dateTime: Date.now(),
                };
                return data;
            }
            catch (err) {
                throw new Error(`Failed to export wallet: ${err}`);
            }
        };
        this.validateAddress = async (address, coin) => {
            try {
                if (address.includes(".defix3")) {
                    const user = await this.userService.getUserByDefixId(address);
                    if (!user)
                        return false;
                    return true;
                }
                else {
                    return blockchain_1.blockchainService[coin.toLowerCase()].isAddress(address);
                }
                throw new Error(`Invalid coin`);
            }
            catch (err) {
                throw new Error(`Failed to validate address: ${err}`);
            }
        };
        /**
         * Utils for WalletService
         */
        this.saveWalletDefix = async (mnemonic, wallet, language = "en") => {
            try {
                const importId = await utils_shared_1.UtilsShared.getIdNear(mnemonic);
                const user = await this.userService.createUser(wallet.defixId, importId, language);
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
        };
        this.validateWalletsUser = async (user, wallet) => {
            try {
                const walletsUser = await this.addressService.getAddressesByDefixId(user.defixId);
                for (let credential of wallet.credentials) {
                    if (!walletsUser.find((element) => element.blockchain === credential.name)) {
                        this.addressService.createAddress(user, credential.name, credential.address);
                    }
                }
            }
            catch (err) {
                throw new Error(`Failed to validate wallet address: ${err}`);
            }
        };
        this.userService = new user_service_1.UserService();
        this.addressService = new address_service_1.AddressService();
    }
}
exports.WalletService = WalletService;
