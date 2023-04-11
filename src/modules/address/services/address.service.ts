import { UtilsShared } from "../../../shared/utils/utils.shared";
import { UserEntity } from "../../users/entities/user.entity";
import { AddressEntity } from "../entities/address.entity";

export class AddressService {
  public createAddress = async (user: UserEntity, blockchain: string, address: string) => {
    try {
      const walletAddress = new AddressEntity();

      walletAddress.user = user;
      walletAddress.blockchain = blockchain;
      walletAddress.address = address;

      return await walletAddress.save();
    } catch (err) {
      throw new Error(`Failed to create address: ${err}`);
    }
  };

  public getAddressByDefixId = async (defixId: string, blockchain: string) => {
    try {
      const address = await AddressEntity.findOneBy({
        user: { defixId: defixId },
        blockchain,
      });
      return address;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };

  public getAddressesByDefixId = async (defixId: string) => {
    try {
      return await AddressEntity.findBy({
        user: { defixId: defixId },
      });
    } catch (err) {
      throw new Error(`Failed to get addresses: ${err}`);
    }
  };
}
