import dataSource from "../../../config/dataSource";
import { UtilsShared } from "../../../shared/utils/utils.shared";
import { UserEntity } from "../entities/user.entity";
import { UserService } from "./user.service";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export class TwoFAService extends UserService {
  constructor() {
    super();
  }

  public generateTwoFA = async (defixId: string) => {
    try {
      const user = await this.getUserByDefixId(defixId);

      if (!user) throw new Error(`User not exists.`);

      // if (user.twofa) throw new Error(`2fa is already active.`);

      let secret;

      if (!user.secret) {
        secret = authenticator.generateSecret();

        const userUpdated = await this.updateUser(defixId, { secret });

        if (userUpdated.affected === 0) throw new Error(`Failed to update user.`);
      } else {
        secret = user.secret;
      }

      const codeAuth = authenticator.keyuri(defixId, "Defix3 App", secret);

      // const qr = await QRCode.toDataURL(codigo);

      console.log("QR", await QRCode.toDataURL(codeAuth));

      return { codeAuth, secret };
    } catch (err) {
      throw new Error(`Failed to generate 2fa, ${err}`);
    }
  };

  public activateTwoFA = async (defixId: string, code2fa: string) => {
    try {
      const user = await this.getUserByDefixId(defixId);

      if (!user) throw new Error(`User not exists.`);

      if (!user.secret) throw new Error(`The user does not have the secret.`);

      const auth = authenticator.check(code2fa, user.secret);

      if (!auth) throw new Error(`Error code 2fa.`);

      const userUpdated = await this.updateUser(defixId, { twofa: true });
      if (userUpdated.affected === 0) throw new Error(`Failed to update user.`);

      return;
    } catch (err) {
      throw new Error(`Failed to activate 2fa, ${err}`);
    }
  };

  public deactivateTwoFA = async (defixId: string, code2fa: string) => {
    try {
      const user = await this.getUserByDefixId(defixId);

      if (!user) throw new Error(`User not exists.`);

      if (!user.secret) throw new Error(`The user does not have the secret.`);

      const auth = authenticator.check(code2fa, user.secret);

      if (!auth) throw new Error(`Error code 2fa.`);

      const userUpdated = await this.updateUser(defixId, {
        twofa: false,
        secret: null,
      });
      if (userUpdated.affected === 0) throw new Error(`Failed to update user.`);

      return;
    } catch (err) {
      throw new Error(`Failed to deactivate 2fa, ${err}`);
    }
  };

  public checkTwoFA = async (code2fa: string, secret: string) => {
    try {
      const auth = authenticator.check(code2fa, secret);

      return auth;
    } catch (err) {
      throw new Error(`Failed to validate 2fa, ${err}`);
    }
  };

  public statusTwoFA = async (defixId: string) => {
    try {
      const user = await this.getUserByDefixId(defixId);

      if (!user) throw new Error(`User not exists.`);

      return user.twofa;
    } catch (err) {
      throw new Error(`Failed to generate 2fa, ${err}`);
    }
  };
}
