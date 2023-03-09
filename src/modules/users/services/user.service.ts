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

      user.defix_id = defixId;
      user.import_id = importId;
      email ? (user.email = email) : undefined;

      const userSaved = await user.save();

      return userSaved;
    } catch (err) {
      throw new Error(`Failed to create user: ${err}`);
    }
  };

  public getUserByImportId = async (import_id: string) => {
    return await UserEntity.findOneBy({ import_id });
  };

  public getUserByDefixId = async (defix_id: string) => {
    return await UserEntity.findOneBy({ defix_id });
  };

  public getUsers = async () => {
    return await UserEntity.find({ select: ["defix_id", "id"] });
  };

  public getUserDataByDefixId = async (defixId: string) => {
    const userData = await UserEntity.createQueryBuilder("user")
      .select([
        "user.defix_id",
        "user.email",
        "user.flag_send",
        "user.flag_receive",
        "user.flag_dex",
        "user.flag_fiat",
        "user.name",
        "user.lastname",
        "user.legal_document",
        "user.type_document",
        "user.dosfa",
        "user.close_sessions",
      ])
      .where("user.defix_id = :defixId", { defixId: defixId })
      .getOne();

    return userData;
  };

  public closeAllSessions = async (defixId: string) => {
    try {
      const user = await this.getUserByDefixId(defixId);
      if (!user) throw new Error(`User not exists.`);

      const result = await UserEntity.update(
        { defix_id: defixId },
        { close_sessions: true }
      );

      if (result.affected === 0)
        throw new Error(`Failed to close all sessions.`);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to close all sessions.`);
    }
  };

  public updateUser = async (user: UserEntity) => {};
}
