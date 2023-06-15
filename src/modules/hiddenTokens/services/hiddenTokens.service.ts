import { UtilsShared } from "../../../shared/utils/utils.shared";
import { GeneralService } from "../../general/services/general.service";
import { UserEntity } from "../../users/entities/user.entity";
import { HiddenTokensLimitEntity } from "../entities/hiddenTokensLimit.entity";

export class HiddenTokensService {
  private generalService: GeneralService;

  constructor() {
    this.generalService = new GeneralService();
  }

  public getTokensByDefixId = async (defixId: string) => {
    try {
      const cryptos = await this.generalService.getCryptos();

      const datos = [];

      const tokensHidden = await this.getHiddenTokensByDefixId(defixId);

      console.log(tokensHidden);

      for (let crypto of cryptos) {
        if (crypto.limit_order) {
          for (let token of crypto.tokens) {
            if (tokensHidden.find((element) => element.tokenId === Number(token.id))) {
              token.active = false;
            } else {
              token.active = true;
            }
            token.blockchain = crypto.blockchain;
            token.blockchain_coin = crypto.coin;
            datos.push(token);
          }
        }
      }
      return datos;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };

  public createHiddenToken = async (defixId: string, tokenId: number) => {
    try {
      const hiddenToken = new HiddenTokensLimitEntity();

      hiddenToken.user = defixId;
      hiddenToken.tokenId = tokenId;

      const hiddenTokenSaved = await hiddenToken.save();

      return hiddenTokenSaved;
    } catch (err) {
      throw new Error(`Failed to create hiddenToken: ${err}`);
    }
  };

  public deleteHiddenToken = async (id: string) => {
    try {
      return await HiddenTokensLimitEntity.delete({ id });
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };

  public getHiddenTokensByDefixId = async (defixId: string) => {
    const hiddenTokens = await HiddenTokensLimitEntity.find({
      where: { user: defixId },
    });

    return hiddenTokens;
  };

  public getHiddenTokenById = async (user: string, tokenId: number) => {
    return await HiddenTokensLimitEntity.findOneBy({ user, tokenId });
  };
}
