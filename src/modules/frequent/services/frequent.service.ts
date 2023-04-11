import { UtilsShared } from "../../../shared/utils/utils.shared";
import { UserEntity } from "../../users/entities/user.entity";
import { UserService } from "../../users/services/user.service";
import { FrequentEntity } from "../entities/frequent.entity";

export class FrequentService extends UserService {
  public createFrequent = async (user: string, frequentUser: string, typeTxn: string) => {
    try {
      const userFrequent = await this.getFrequentByDefixId(user, frequentUser, typeTxn);
      if (userFrequent) throw new Error(`User frequent already exists.`);

      const userDefix = await this.getUserByDefixId(user);
      if (!userDefix) throw new Error(`User does not exists.`);

      const frequent = new FrequentEntity();

      frequent.user = userDefix;
      frequent.frequentUser = frequentUser;
      frequent.typeTxn = typeTxn;

      return await frequent.save();
    } catch (err: any) {
      console.log(`Failed to create frequent user: ${err.message}`);
      return;
      // throw new Error(`Failed to create frequent user: ${err.message}`);
    }
  };

  public getFrequentByDefixId = async (defixId: string, frequentUser: string, typeTxn: string) => {
    try {
      const frequent = await FrequentEntity.findOneBy({
        user: { defixId },
        frequentUser,
        typeTxn,
      });
      return frequent;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };

  public getAllFrequentByDefixId = async (defixId: string) => {
    try {
      const frequentAll = await FrequentEntity.find({
        where: { user: { defixId: defixId } },
      });
      return frequentAll;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };

  public deleteFrequentById = async (id: number) => {
    try {
      return await FrequentEntity.delete({ id });
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };
}
