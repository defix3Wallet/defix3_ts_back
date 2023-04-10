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
import {
  LimitOrderToSend,
  OptimalRate,
  SignableOrderData,
  constructAxiosFetcher,
  constructBuildLimitOrder,
  constructEthersContractCaller,
  constructPartialSDK,
  constructPostLimitOrder,
  constructSignLimitOrder,
  constructSimpleSDK,
} from "@paraswap/sdk";
import axios from "axios";
import { ethers } from "ethers";
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const ETHERSCAN = process.env.ETHERSCAN;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`));

const paraSwap = constructSimpleSDK({
  chainId: Number(process.env.PARASWAP_ETH),
  axios,
});

const walletAddress = "0x7460CA23e35718FB30f9888F03d31C69Df507612";

const chainId = 1; // suggested, or use your own number
const connector = new Web3ProviderConnector(web3);
const contractAddress = limirOrderProtocolAdresses[chainId];
const seriesContractAddress = seriesNonceManagerContractAddresses[chainId];

const limitOrderBuilder = new LimitOrderBuilder(seriesContractAddress, chainId, connector);

export class LimitOrderController {
  private limitOrderService: LimitOrderService;
  private mailService: MailShared;

  constructor() {
    this.limitOrderService = new LimitOrderService();
    this.mailService = new MailShared();
  }

  public getLimitOrder = async (req: Request, res: Response) => {
    try {
      const account = "0x1234...";

      const fetcher = constructAxiosFetcher(axios);

      // provider must have write access to account
      // this would usually be wallet provider (Metamask)
      const provider = ethers.getDefaultProvider(1);
      const contractCaller = constructEthersContractCaller(
        {
          ethersProviderOrSigner: provider,
          EthersContract: ethers.Contract,
        },
        account
      );

      // type BuildLimitOrderFunctions
      // & SignLimitOrderFunctions
      // & PostLimitOrderFunctions

      const paraSwapLimitOrderSDK = constructPartialSDK(
        {
          chainId: 1,
          fetcher,
          contractCaller,
        },
        constructBuildLimitOrder,
        constructSignLimitOrder,
        constructPostLimitOrder
      );

      const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      const HEX = "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39";

      const orderInput = {
        nonce: 1,
        expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // week from now, in sec
        makerAsset: DAI,
        takerAsset: HEX,
        makerAmount: (1e18).toString(10),
        takerAmount: (8e18).toString(10),
        maker: account,
      };

      const signableOrderData: SignableOrderData = await paraSwapLimitOrderSDK.buildLimitOrder(orderInput);

      console.log(signableOrderData);

      const signature: string = await paraSwapLimitOrderSDK.signLimitOrder(signableOrderData);

      const orderToPostToApi: LimitOrderToSend = {
        ...signableOrderData.data,
        signature,
      };

      const newOrder = await paraSwapLimitOrderSDK.postLimitOrder(orderToPostToApi);
      console.log(newOrder);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  };

  public getLimitOrder2 = async (req: Request, res: Response) => {
    try {
      const limitOrder = limitOrderBuilder.buildLimitOrder({
        makerAssetAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        takerAssetAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        makerAddress: "0x7460CA23e35718FB30f9888F03d31C69Df507612",
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

      const privateKey = "0x64a0c662f57dc25fac5dd9ff24b9c6b6c100e2d3a0501e2ec94eb792e8e9dd6d";

      const privateKeyProviderConnector = new PrivateKeyProviderConnector(privateKey, web3);

      const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(walletAddress, limitOrderTypedData);

      console.log("Signature");
      console.log(limitOrderSignature);

      const limitOrderHash = limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);

      console.log(limitOrderHash);

      const signature = await privateKeyProviderConnector.signTypedData(walletAddress, limitOrderTypedData);

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
  privateKeyToUint8Array(privateKey: string): Uint8Array {
    const buffer = new Uint8Array(32);
    const arrayPrivateKey = Buffer.from(privateKey, "hex");

    for (let i = 0; i < 32; i++) {
      buffer[i] = arrayPrivateKey[i];
    }

    return buffer;
  }
}
