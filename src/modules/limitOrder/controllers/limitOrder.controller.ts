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

  public cancelLimitOrder = async (req: Request, res: Response) => {
    try {
      const { defixId, pkEncrypt, orderHash, blockchain } = req.body;

      if (!defixId || !pkEncrypt || !blockchain || !orderHash) return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      const address = await UtilsShared.getAddressUser(defixId, blockchain);

      if (!address) return res.status(400).send({ message: "Address invalid." });

      const limitOrder = await this.limitOrderService.cancelLimitOrder(blockchain, orderHash, privateKey);

      res.json(limitOrder);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public getAllLimitOrder = async (req: Request, res: Response) => {
    try {
      const { defixId } = req.body;

      if (!defixId) return res.status(400).send({ message: "Invalid data." });

      const address = await UtilsShared.getAddressUser(defixId, "ETH");

      if (!address) return res.status(400).send({ message: "Address invalid." });

      const orders = await this.limitOrderService.getAllLimitOrder("ETH", address);

      res.json(orders);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public getOrderBook = async (req: Request, res: Response) => {
    try {
      const { fromCoin, toCoin } = req.body;

      if (!fromCoin || !toCoin) return res.status(400).send({ message: "Invalid data." });

      let fromToken: any = await UtilsShared.getTokenContract(fromCoin, "ETH");

      let toToken: any = await UtilsShared.getTokenContract(toCoin, "ETH");

      if (!fromToken || !toToken) return res.status(400).send({ message: "Tokens invalid." });

      const orders = await this.limitOrderService.getOrderBook("ETH", fromToken.contract, toToken.contract);

      res.json(orders);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
