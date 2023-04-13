import { Request, Response } from "express";
import { LimitOrderService } from "../services/limitOrder.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { MailShared } from "../../../shared/email/email.shared";
import { UtilsShared } from "../../../shared/utils/utils.shared";

export class LimitOrderController {
  private limitOrderService: LimitOrderService;
  private mailService: MailShared;

  constructor() {
    this.limitOrderService = new LimitOrderService();
    this.mailService = new MailShared();
  }

  public sendLimitOrder = async (req: Request, res: Response) => {
    try {
      const { defixId, pkEncrypt, fromCoin, toCoin, srcAmount, destAmount, blockchain } = req.body;

      if (!defixId || !pkEncrypt || !fromCoin || !toCoin || !srcAmount || !destAmount || !blockchain)
        return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      const address = await UtilsShared.getAddressUser(defixId, blockchain);

      if (!address) return res.status(400).send({ message: "Address invalid." });

      const limitOrder = await this.limitOrderService.sendLimitOrder(fromCoin, toCoin, srcAmount, destAmount, blockchain, address, privateKey);

      res.json(limitOrder);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
