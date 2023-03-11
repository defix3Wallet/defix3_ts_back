import { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service";

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  public setEmailSubscription = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).send({ message: "Invalid data." });
      return await this.subscriptionService.createSubscription(email);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
