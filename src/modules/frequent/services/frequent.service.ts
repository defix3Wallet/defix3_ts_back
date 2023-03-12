import { UtilsShared } from "../../../shared/utils/utils.shared";
import { UserEntity } from "../../users/entities/user.entity";
import { UserService } from "../../users/services/user.service";
import { FrequentEntity } from "../entities/frequent.entity";

export class FrequentService extends UserService {
  public createFrequent = async (user: string, frequentUser: string) => {
    try {
      const userFrequent = await this.getFrequentByDefixId(user, frequentUser);
      if (userFrequent) throw new Error(`User frequent already exists.`);

      const userDefix = await this.getUserByDefixId(user);
      if (!userDefix) throw new Error(`User does not exists.`);

      const frequent = new FrequentEntity();

      frequent.user = userDefix;
      frequent.frequentUser = frequentUser;

      return await frequent.save();
    } catch (err: any) {
      throw new Error(`Failed to create frequent user: ${err.message}`);
    }
  };

  public getFrequentByDefixId = async (
    defixId: string,
    frequentUser: string
  ) => {
    try {
      const frequent = await FrequentEntity.findOneBy({
        user: { defixId },
        frequentUser,
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
