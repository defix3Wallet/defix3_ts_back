import { Request, Response } from "express";
import { TwoFAService } from "../services/twoFA.service";

export class TwoFAController {
  private twoFAService: TwoFAService;

  constructor() {
    this.twoFAService = new TwoFAService();
  }

  public generateTwoFA = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;

      const response = await this.twoFAService.generateTwoFA(defixId);

      return res.send(response);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public activateTwoFA = async (req: Request, res: Response) => {
    try {
      const { defixId, code2fa } = req.body;

      if (!code2fa) return res.status(400).send({ message: "Invalid data." });

      await this.twoFAService.activateTwoFA(defixId, code2fa);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public deactivateTwoFA = async (req: Request, res: Response) => {
    try {
      const { defixId, code2fa } = req.body;

      if (!code2fa) return res.status(400).send({ message: "Invalid data." });

      await this.twoFAService.deactivateTwoFA(defixId, code2fa);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public statusTwoFA = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;

      const response = await this.twoFAService.statusTwoFA(defixId);

      return res.send(response);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
