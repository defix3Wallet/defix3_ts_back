import dataSource from "../../../config/dataSource";
import { UtilsShared } from "../../../shared/utils/utils.shared";
import { UserEntity } from "../entities/user.entity";

export class UserService {
  public createUser = async (
    defixId: string,
    importId: string,
    email?: string
  ) => {
    try {
      const user = new UserEntity();

      user.defixId = defixId;
      user.importId = importId;
      email ? (user.email = email) : undefined;

      const userSaved = await user.save();

      return userSaved;
    } catch (err) {
      throw new Error(`Failed to create user: ${err}`);
    }
  };

  public getUserByImportId = async (importId: string) => {
    return await UserEntity.findOneBy({ importId });
  };

  public getUserByDefixId = async (defixId: string) => {
    return await UserEntity.findOneBy({ defixId });
  };

  public getUsers = async () => {
    return await UserEntity.find({ select: ["defixId", "id"] });
  };

  public getUserDataByDefixId = async (defixId: string) => {
    const userData = await UserEntity.createQueryBuilder("user")
      .select([
        "user.defixId",
        "user.email",
        "user.flagNews",
        "user.flagDeposit",
        "user.flagWithdraw",
        "user.flagSign",
        "user.flagEvolution",
        "user.name",
        "user.lastname",
        "user.avatar",
        "user.legalDocument",
        "user.passcode",
        "user.typeDocument",
        "user.closeSessions",
      ])
      .where("user.defixId = :defixId", { defixId: defixId })
      .getOne();

    return userData;
  };

  public updateUser = async (defixId: string, body: any) => {
    const result = await UserEntity.update({ defixId: defixId }, body);

    if (result.affected === 0) throw new Error(`Failed to updated user.`);

    return result;
  };
}
