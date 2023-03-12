import { EthereumService } from "./ethereum/ethereum.service";
import { BinanceService } from "./binance/binance.service";
import { BitcoinService } from "./bitcoin/bitcoin.service";
import { NearService } from "./near/near.service";
import { TronService } from "./tron/tron.service";

export const blockchainService = {
  btc: new BitcoinService(),
  eth: new EthereumService(),
  bnb: new BinanceService(),
  near: new NearService(),
  trx: new TronService(),
};
