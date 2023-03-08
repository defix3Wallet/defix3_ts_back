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
}
