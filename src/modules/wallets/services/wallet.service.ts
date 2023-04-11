import { UtilsShared } from "../../../shared/utils/utils.shared";
import { CredentialInterface } from "../interfaces/credential.interface";
import { WalletInterface } from "../interfaces/wallet.interface";
import { UserService } from "../../users/services/user.service";
import { blockchainService } from "../../../blockchain";
import { UserEntity } from "../../users/entities/user.entity";
import { AddressService } from "../../address/services/address.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";

export class WalletService {
  private userService: UserService;
  private addressService: AddressService;

  constructor() {
    this.userService = new UserService();
    this.addressService = new AddressService();
  }

  public createWalletDefix = async (defixId: string, mnemonic: string) => {
    try {
      const credentials: CredentialInterface[] = [];
      for (const service of Object.values(blockchainService)) {
        credentials.push(await service.fromMnemonic(mnemonic));
      }

      const wallet: WalletInterface = {
        defixId: defixId,
        credentials: credentials,
      };

      await this.saveWalletDefix(mnemonic, wallet);

      return wallet;
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to create wallet: ${err}`);
    }
  };

  public importWalletDefix = async (mnemonic: string) => {
    try {
      const importId = await UtilsShared.getIdNear(mnemonic);

      const user = await this.userService.getUserByImportId(importId);

      if (!user) throw new Error("Wallet does not exist in Defix3");

      const defixId = user.defixId;

      const credentials: CredentialInterface[] = [];
      for (const service of Object.values(blockchainService)) {
        credentials.push(await service.fromMnemonic(mnemonic));
      }

      const wallet: WalletInterface = {
        defixId: defixId,
        credentials: credentials,
      };

      this.validateWalletsUser(user, wallet);

      return wallet;
    } catch (err) {
      throw new Error(`Failed to import wallet: ${err}`);
    }
  };

  public importFromPrivateKey = async (privateKey: string) => {
    try {
      const credentials: CredentialInterface[] = [];
      for (const service of Object.values(blockchainService)) {
        const credential = await service.fromPrivateKey(privateKey);
        if (credential) {
          credentials.push(credential);
        }
      }

      if (credentials.length === 0) throw new Error(`Failed private key`);

      const wallet: WalletInterface = {
        defixId: credentials[0].address,
        credentials: credentials,
      };

      return wallet;
    } catch (err) {
      throw new Error(`Failed to import wallet: ${err}`);
    }
  };

  public importFromJson = async (dataImport: any) => {
    try {
      const credentials: CredentialInterface[] = [];
      let defixId: any;
      if (CryptoShared.decryptAES(dataImport.typeLog) === "MNEMONIC") {
        const mnemonic = CryptoShared.decryptAES(dataImport.ciphertext);
        const importId = await UtilsShared.getIdNear(mnemonic);

        const user = await this.userService.getUserByImportId(importId);

        if (!user) throw new Error("Wallet does not exist in Defix3");

        defixId = user.defixId;

        for (const service of Object.values(blockchainService)) {
          credentials.push(await service.fromMnemonic(mnemonic));
        }
      } else if (CryptoShared.decryptAES(dataImport.typeLog) === "PRIVATE_KEY") {
        for (const service of Object.values(blockchainService)) {
          const credential = await service.fromPrivateKey(CryptoShared.decryptAES(dataImport.ciphertext));
          if (credential) {
            credentials.push(credential);
          }
        }
        defixId = credentials[0].address;
      } else {
        throw new Error(`Invalid mnemonic and private key`);
      }
      const wallet: WalletInterface = {
        defixId: defixId,
        credentials: credentials,
      };
      return wallet;
    } catch (err) {
      throw new Error(`Failed to export wallet: ${err}`);
    }
  };

  public exportWalletJson = async (ciphertext: string, typeLog: string) => {
    try {
      const data = {
        ciphertext: CryptoShared.encryptAES(ciphertext),
        typeLog: CryptoShared.encryptAES(typeLog),
        dateTime: Date.now(),
      };

      return data;
    } catch (err) {
      throw new Error(`Failed to export wallet: ${err}`);
    }
  };

  public validateAddress = async (address: string, coin: string) => {
    try {
      if (Object.keys(blockchainService).find((key) => key === coin.toLowerCase())) {
        return blockchainService[coin.toLowerCase() as keyof typeof blockchainService].isAddress(address);
      }
      throw new Error(`Invalid coin`);
    } catch (err) {
      throw new Error(`Failed to validate address: ${err}`);
    }
  };

  /**
   * Utils for WalletService
   */
  private saveWalletDefix = async (mnemonic: string, wallet: WalletInterface) => {
    try {
      const importId = await UtilsShared.getIdNear(mnemonic);

      const user = await this.userService.createUser(wallet.defixId, importId);

      if (!user) throw new Error("Wallet does not exist in Defix3");

      for (let credential of wallet.credentials) {
        this.addressService.createAddress(user, credential.name, credential.address);
      }

      return user;
    } catch (err) {
      throw new Error(`Failed to save wallet addresses: ${err}`);
    }
  };

  private validateWalletsUser = async (user: UserEntity, wallet: WalletInterface) => {
    try {
      const walletsUser = await this.addressService.getAddressesByDefixId(user.defixId);

      for (let credential of wallet.credentials) {
        if (!walletsUser.find((element) => element.blockchain === credential.name)) {
          this.addressService.createAddress(user, credential.name, credential.address);
        }
      }
    } catch (err) {
      throw new Error(`Failed to validate wallet address: ${err}`);
    }
  };
}
