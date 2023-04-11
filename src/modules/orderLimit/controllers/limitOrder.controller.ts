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
import { ethers } from "ethers";
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ETHERSCAN = process.env.ETHERSCAN;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`));

const walletAddress = "0x7460CA23e35718FB30f9888F03d31C69Df507612";

const chainId = 1; // suggested, or use your own number
const connector = new Web3ProviderConnector(web3);
const contractAddress = limirOrderProtocolAdresses[chainId];
const seriesContractAddress = seriesNonceManagerContractAddresses[chainId];

const limitOrderBuilder = new LimitOrderBuilder(seriesContractAddress, chainId, connector);
const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, chainId, connector);

export class LimitOrderController {
  private limitOrderService: LimitOrderService;
  private mailService: MailShared;

  constructor() {
    this.limitOrderService = new LimitOrderService();
    this.mailService = new MailShared();
  }

  public getLimitOrder = async (req: Request, res: Response) => {
    try {
      // Creates predicate that restricts Limit Order invalidation conditions
      // Because timestampBelowAndNonceEquals is method of another contract arbitraryStaticCall() is necessary

      const limitOrder = limitOrderBuilder.buildLimitOrder({
        makerAssetAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        takerAssetAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        makerAddress: walletAddress,
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

      const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);

      const privateKey = "64a0c662f57dc25fac5dd9ff24b9c6b6c100e2d3a0501e2ec94eb792e8e9dd6d";

      const privateKeyProviderConnector = new PrivateKeyProviderConnector(privateKey, web3);

      console.log("privateKeyProviderConnector", limitOrderTypedData);

      const limitOrderSignature = await privateKeyProviderConnector.signTypedData(walletAddress, limitOrderTypedData);

      console.log("Signature");
      console.log(limitOrderSignature);
      // console.log(limitOrderSignature);

      const callData = limitOrderProtocolFacade.fillLimitOrder({
        order: limitOrder,
        signature: limitOrderSignature,
        makingAmount: "100",
        takingAmount: "0",
        thresholdAmount: "50",
      });

      console.log("BRRRRRRr");
      console.log(callData);

      const provider = ethers.getDefaultProvider(1);
      const signer = new ethers.Wallet(privateKey, provider);

      const resp = await signer.sendTransaction({
        from: walletAddress,
        gasLimit: 210_000, // Set your gas limit
        gasPrice: 40000, // Set your gas price
        to: contractAddress,
        data: callData,
      });

      console.log("RES", resp);

      res.json(resp);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };
}
