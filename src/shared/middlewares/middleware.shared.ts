import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../modules/users/entities/user.entity";

export class SharedMiddleware {
  async defixIdAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const { defixId } = req.body;
      if (!defixId || !defixId.includes(".defix3") || defixId.includes(" "))
        return res.status(400).send({ message: "Error DefixId." });
      const user = await UserEntity.findOneBy({ defix_id: defixId });

      if (!user)
        return res.status(400).send({ message: "User already exists." });

      next();
    } catch (err) {
      res.status(500).send({ message: "Internal server error." });
    }
  }
}
