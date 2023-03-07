import { UtilsShared } from "../../../shared/utils/utils.shared";
import { User } from "../entities/user.entity";

export class UserService {
  public createUser = async (
    defixId: string,
    importId: string,
    email?: string
  ) => {
    try {
      const user = new User();

      user.defix_id = defixId;
      user.import_id = importId;
      email ? (user.email = email) : undefined;

      const userSaved = await user.save();

      return userSaved;
    } catch (err) {
      throw new Error(`Failed to create user: ${err}`);
    }
  };
}
