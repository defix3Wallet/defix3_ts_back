import { UtilsShared } from "../../../shared/utils/utils.shared";
import { CredentialInterface } from "../interfaces/credential.interface";
import { WalletInterface } from "../interfaces/wallet.interface";
import { UserService } from "../../users/services/user.service";
import { WalletEntity } from "../entities/wallet.entity";
import { User } from "../../users/entities/user.entity";

export class WalletService {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  public createWalletDefix = async (defixId: string, mnemonic: string) => {
    try {
      const credentials: CredentialInterface[] = [
        await createWalletBTC(mnemonic),
        await createWalletETH(mnemonic),
        await createWalletNEAR(mnemonic),
        await createWalletTRON(mnemonic),
        await createWalletBNB(mnemonic),
      ];

      const wallet: WalletInterface = {
        defixId: defixId,
        credentials: credentials,
      };

      const saved = await this.saveWallet(mnemonic, wallet);

      if (!saved) {
        throw new Error("Failed to save wallet to user");
      }

      return wallet;
    } catch (err) {
      throw new Error(`Failed to create wallet: ${err}`);
    }
  };

  private saveWallet = async (mnemonic: string, wallet: WalletInterface) => {
    const nearId = await UtilsShared.getIdNear(mnemonic);

    const user = await this.userService.createUser(wallet.defixId, nearId);

    if (!user) return false;

    for (let credential of wallet.credentials) {
      const walletAddress = new WalletEntity();
      walletAddress.user = user;
      walletAddress.blockchain = credential.name;
      walletAddress.address = credential.address;
      await walletAddress.save();
    }

    return user;
  };
}
