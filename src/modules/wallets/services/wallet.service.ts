import { UtilsShared } from "../../../shared/utils/utils.shared";
import { CredentialInterface } from "../interfaces/credential.interface";
import { WalletInterface } from "../interfaces/wallet.interface";
import { UserService } from "../../users/services/user.service";
import { blockchain } from "../../../blockchain";
import { UserEntity } from "../../users/entities/user.entity";
import { AddressService } from "../../address/services/address.service";

export class WalletService {
  private userService: UserService;
  private addressService: AddressService;

  constructor() {
    this.userService = new UserService();
    this.addressService = new AddressService();
  }

  public createWalletDefix = async (defixId: string, mnemonic: string) => {
    try {
      const credentials: CredentialInterface[] = await Promise.all([
        blockchain.btc.fromMnemonic(mnemonic),
        blockchain.eth.fromMnemonic(mnemonic),
        blockchain.bnb.fromMnemonic(mnemonic),
        blockchain.near.fromMnemonic(mnemonic),
        blockchain.trx.fromMnemonic(mnemonic),
      ]);

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

      // const walletNear = (
      //   await WalletEntity.findOneBy({
      //     user: { defix_id: user.defix_id },
      //     blockchain: "NEAR",
      //   })
      // )?.address;

      // if (!walletNear) throw new Error("Failed to import wallet.");

      const credentials: CredentialInterface[] = await Promise.all([
        blockchain.btc.fromMnemonic(mnemonic),
        blockchain.eth.fromMnemonic(mnemonic),
        blockchain.bnb.fromMnemonic(mnemonic),
        blockchain.near.fromMnemonic(mnemonic),
        blockchain.trx.fromMnemonic(mnemonic),
      ]);

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
      for (const service of Object.values(blockchain)) {
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

  public validateAddress = async (address: string, coin: string) => {
    try {
      if (Object.keys(blockchain).find((key) => key === coin.toLowerCase())) {
        return blockchain[
          coin.toLowerCase() as keyof typeof blockchain
        ].isAddress(address);
      }
      throw new Error(`Invalid coin`);
    } catch (err) {
      throw new Error(`Failed to validate address: ${err}`);
    }
  };

  /**
   * Utils for WalletService
   */
  private saveWalletDefix = async (
    mnemonic: string,
    wallet: WalletInterface
  ) => {
    try {
      const importId = await UtilsShared.getIdNear(mnemonic);

      const user = await this.userService.createUser(wallet.defixId, importId);

      if (!user) throw new Error("Wallet does not exist in Defix3");

      for (let credential of wallet.credentials) {
        this.addressService.createAddress(
          user,
          credential.name,
          credential.address
        );
      }

      return user;
    } catch (err) {
      throw new Error(`Failed to save wallet addresses: ${err}`);
    }
  };

  private validateWalletsUser = async (
    user: UserEntity,
    wallet: WalletInterface
  ) => {
    try {
      const walletsUser = await this.addressService.getAddressesByDefixId(
        user.defixId
      );

      for (let credential of wallet.credentials) {
        if (
          !walletsUser.find((element) => element.blockchain === credential.name)
        ) {
          this.addressService.createAddress(
            user,
            credential.name,
            credential.address
          );
        }
      }
    } catch (err) {
      throw new Error(`Failed to validate wallet address: ${err}`);
    }
  };
}
