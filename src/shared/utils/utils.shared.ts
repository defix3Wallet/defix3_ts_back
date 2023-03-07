import { WalletEntity } from "../../modules/wallets/entities/wallet.entity";
const nearSEED = require("near-seed-phrase");

export class UtilsShared {
  static async getAddressUser(defixId: string, blockchain: string) {
    try {
      const address = await WalletEntity.findOneBy({
        user: { defix_id: defixId },
        blockchain: blockchain,
      });

      if (!address) return false;

      return address.address;
    } catch (error) {
      return false;
    }
  }
  static async getIdNear(mnemonic: string) {
    const walletSeed = await nearSEED.parseSeedPhrase(mnemonic);
    const split = String(walletSeed.publicKey).split(":");
    const id = String(split[1]);
    return id;
  }
}
