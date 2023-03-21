import { Request, Response } from "express";
import { LimitOrderService } from "../services/limitOrder.service";
import { CryptoShared } from "../../../shared/crypto/crypto.shared";
import { MailShared } from "../../../shared/email/email.shared";
import { UtilsShared } from "../../../shared/utils/utils.shared";

import Web3 from "web3";
import {
  limirOrderProtocolAdresses,
  seriesNonceManagerContractAddresses,
  ChainId,
  Erc20Facade,
  LimitOrderBuilder,
  LimitOrderProtocolFacade,
  LimitOrderPredicateBuilder,
  NonceSeriesV2,
  SeriesNonceManagerFacade,
  SeriesNonceManagerPredicateBuilder,
  Web3ProviderConnector,
  LimitOrderPredicateCallData,
  PrivateKeyProviderConnector,
} from "@1inch/limit-order-protocol-utils";

const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`
  )
);

const walletAddress = "0x7460CA23e35718FB30f9888F03d31C69Df507612";

const chainId = 1; // suggested, or use your own number
const connector = new Web3ProviderConnector(web3);
const contractAddress = limirOrderProtocolAdresses[chainId];
const seriesContractAddress = seriesNonceManagerContractAddresses[chainId];

const limitOrderBuilder = new LimitOrderBuilder(
  seriesContractAddress,
  chainId,
  connector
);

export class LimitOrderController {
  private limitOrderService: LimitOrderService;
  private mailService: MailShared;

  constructor() {
    this.limitOrderService = new LimitOrderService();
    this.mailService = new MailShared();
  }

  public getLimitOrder = async (req: Request, res: Response) => {
    try {
      const limitOrder = limitOrderBuilder.buildLimitOrder({
        makerAssetAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        takerAssetAddress: "0x111111111117dc0aa78b770fa6a738034120c302",
        makerAddress: "0xfb3c7ebccccAA12B5A884d612393969Adddddddd",
        makingAmount: "100",
        takingAmount: "200",
        // predicate = '0x',
        // permit = '0x',
        // receiver = ZERO_ADDRESS,
        // allowedSender = ZERO_ADDRESS,
        // getMakingAmount = ZERO_ADDRESS,
        // getTakingAmount = ZERO_ADDRESS,
        // preInteraction  = '0x',
        // postInteraction = '0x',
      });
      const limitOrderTypedData =
        limitOrderBuilder.buildLimitOrderTypedData(limitOrder);

      const privateKey =
        "0x64a0c662f57dc25fac5dd9ff24b9c6b6c100e2d3a0501e2ec94eb792e8e9dd6d";

      const privateKeyProviderConnector = new PrivateKeyProviderConnector(
        privateKey,
        web3
      );

      // console.log(privateKeyProviderConnector);

      const limitOrderHash =
        limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);

      console.log(limitOrderHash);

      const signature = await privateKeyProviderConnector.signTypedData(
        walletAddress,
        limitOrderTypedData
      );

      console.log(signature);

      console.log("AQUI1");

      // const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(
      //   walletAddress,
      //   limitOrderTypedData
      // );

      // console.log(limitOrderSignature);

      // console.log("AQUI");
      // const limitOrderHash =
      //   limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);

      // console.log(limitOrderHash);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
