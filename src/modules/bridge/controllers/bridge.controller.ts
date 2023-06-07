import { Request, Response } from "express";
import { BridgeService } from "../services/bridge.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { AddressService } from "../../address/services/address.service";

export class BridgeController {
  private bridgeService: BridgeService;
  private addressService: AddressService;

  constructor() {
    this.bridgeService = new BridgeService();
    this.addressService = new AddressService();
  }

  public getFeeBridge = async (req: Request, res: Response) => {
    try {
      const { chainTo, amount, coin, chainFrom } = req.body;

      // let toChain;
      // if (chainTo === "ETH") {
      //   toChain = "ETH";
      // } else if (chainTo === "BNB") {
      //   toChain = "BSC";
      // } else if (chainTo === "NEAR") {
      //   toChain = "AURORA";
      // }

      // let fromChain;
      // if (chainFrom === "ETH") {
      //   fromChain = "ETH";
      // } else if (chainFrom === "BNB") {
      //   fromChain = "BSC";
      // } else if (chainFrom === "NEAR") {
      //   fromChain = "AURORA";
      // }

      // if (!toChain || !fromChain) throw new Error("Error no chaind");

      const resp: any = await this.bridgeService.getFeeBridge(chainTo, amount, coin, chainFrom);

      res.json(resp);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
  };

  public getAddressesBridge = async (req: Request, res: Response) => {
    try {
      const { coin, blockchain } = req.body;
      let chainId;
      if (blockchain === "ETH") {
        chainId = "1";
      } else if (blockchain === "BNB") {
        chainId = "56";
      } else if (blockchain === "NEAR") {
        chainId = "1313161554";
      }

      if (!chainId) throw new Error("Error no chaind ID");

      const resp = this.bridgeService.getAddressesBridge(chainId, coin);

      res.json(resp);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
  };

  public sendBridge = async (req: Request, res: Response) => {
    try {
      const { defixId, pkEncrypt, toAddress, coin, amount, fromChain, toChain } = req.body;

      if (!defixId || !pkEncrypt || !toAddress || !coin || !amount || !fromChain || !toChain)
        return res.status(400).send({ message: "Invalid data." });

      const privateKey = CryptoShared.decrypt(pkEncrypt);

      if (!privateKey) return res.status(400).send({ message: "privateKey invalid." });

      const resp = await this.bridgeService.sendBridge(toAddress, privateKey, coin, fromChain, toChain, amount, defixId);

      console.log(resp);

      res.json(resp);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send(error);
    }
  };
}
