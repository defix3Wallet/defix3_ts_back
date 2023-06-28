import { blockchainService } from "../../../blockchain";
import { CacheConfig } from "../../../config/cacheConfig";
import { Balance } from "../../../interfaces/balance.interface";
import { BalanceCrypto } from "../../../interfaces/balance_crypto.interface";
import { UtilsShared } from "../../../shared/utils/utils.shared";
import { AddressService } from "../../address/services/address.service";

export class BalanceService {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  public getBalance = async (defixId: string) => {
    try {
      const addresses = await this.addressService.getAddressesByDefixId(defixId);
      const balances: BalanceCrypto[] = [];

      const cryptos = await UtilsShared.getCryptos();

      const pnlArray: any = [];
      let pnl = 0;
      let pnlSum = 0;

      for (let crypto of cryptos) {
        const balanceCrypto: BalanceCrypto = {
          coin: crypto.coin,
          blockchain: crypto.blockchain,
          icon: crypto.icon,
          balance: 0,
          tokens: [],
        };

        const addressItem = addresses.find((element) => element.blockchain === crypto.coin);

        if (!addressItem) throw new Error(`Failed to get balance`);

        const address = addressItem.address || "";

        balanceCrypto.balance = await blockchainService[crypto.coin.toLowerCase() as keyof typeof blockchainService].getBalance(address);

        for (let token of crypto.tokens) {
          const itemToken: Balance = {
            coin: token.coin,
            balance: 0,
            icon: token.icon,
          };

          itemToken.balance = await blockchainService[crypto.coin.toLowerCase() as keyof typeof blockchainService].getBalanceToken(
            address,
            token.contract,
            token.decimals
          );

          balanceCrypto.tokens.push(itemToken);
        }

        const coinMarket: any = CacheConfig.nodeCache.get("getRanking");

        if (coinMarket) {
          // const coin = coinMarket.find(() => element);
          const coin = coinMarket.find((element: any) => element.symbol === balanceCrypto.coin.toLowerCase());
          if (coin) {
            const price7d = coin.current_price - (coin.price_change_percentage_7d_in_currency / 100) * coin.current_price;

            pnlArray.push((price7d - coin.current_price) * balanceCrypto.balance);
            pnl += (price7d - coin.current_price) * balanceCrypto.balance;
            pnlSum += price7d * balanceCrypto.balance;
          }
          for (let crypto of balanceCrypto.tokens) {
            const coin = coinMarket.find((element: any) => element.symbol === crypto.coin.toLowerCase());
            if (coin) {
              const price7d = coin.current_price - (coin.price_change_percentage_7d_in_currency / 100) * coin.current_price;
              pnlArray.push((price7d - coin.current_price) * crypto.balance);
              pnl += (price7d - coin.current_price) * crypto.balance;
              pnlSum += price7d * crypto.balance;
            }
          }
        }

        balances.push(balanceCrypto);
      }
      const pnlTotal = (pnl / pnlSum) * 100;
      return { pnl: pnlTotal, balances };
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };
}
