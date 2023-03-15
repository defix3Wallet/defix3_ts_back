import { NextFunction, Request, Response } from "express";
import { UserService } from "../../modules/users/services/user.service";
import { TwoFAService } from "../../modules/users/services/twoFA.service";

export class TwoFAMiddleware {
  private userService: UserService;
  private twoFAService: TwoFAService;

  constructor() {
    this.userService = new UserService();
    this.twoFAService = new TwoFAService();
  }

  async validateTwoFA(req: Request, res: Response, next: NextFunction) {
    try {
      const { defixId, code2fa } = req.body;
      const user = await this.userService.getUserByDefixId(defixId);

      if (!user) return res.status(404).send({ message: `User not exists.` });

      if (!user.twofa) return next;

      if (!code2fa)
        return res
          .status(404)
          .send({ message: `Invalid data, Error: code2fa.` });

      const auth = await this.twoFAService.checkTwoFA(code2fa, user.secret);

      if (!auth) return res.status(401).send({ message: "code 2fa invalid" });

      next();
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  }
}
