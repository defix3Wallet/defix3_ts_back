import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserEntity } from "../entities/user.entity";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public validateDefixId = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;

      const user = await this.userService.getUserByDefixId(defixId);

      if (!user) return res.send(false);

      return res.send(true);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };

  public getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getUsers();
      res.send(users);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };

  public getUserData = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const user = await this.userService.getUserDataByDefixId(defixId);
      if (!user) return res.status(400).send({ message: "User not exists." });
      res.send(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;
      const result = await this.userService.updateUser(defixId, req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  };
}
