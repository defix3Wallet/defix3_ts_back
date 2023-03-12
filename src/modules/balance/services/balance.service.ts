import { blockchainService } from "../../../blockchain";
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
      const addresses = await this.addressService.getAddressesByDefixId(
        defixId
      );
      const balances: BalanceCrypto[] = [];

      const cryptos = await UtilsShared.getCryptos();

      for (let crypto of cryptos) {
        console.log(crypto);
        const balanceCrypto: BalanceCrypto = {
          coin: crypto.coin,
          blockchain: crypto.blockchain,
          icon: crypto.icon,
          balance: 0,
          tokens: [],
        };

        const addressItem = addresses.find(
          (element) => element.blockchain === crypto.coin
        );

        if (!addressItem) throw new Error(`Failed to get balance`);

        const address = addressItem.address || "";

        balanceCrypto.balance = await blockchainService[
          crypto.coin.toLowerCase() as keyof typeof blockchainService
        ].getBalance(address);

        for (let token of crypto.tokens) {
          const itemToken: Balance = {
            coin: token.coin,
            balance: 0,
            icon: token.icon,
          };

          itemToken.balance = await blockchainService[
            crypto.coin.toLowerCase() as keyof typeof blockchainService
          ].getBalanceToken(address, token.contract, token.decimals);

          balanceCrypto.tokens.push(itemToken);
        }

        balances.push(balanceCrypto);
      }
      return balances;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };
}
