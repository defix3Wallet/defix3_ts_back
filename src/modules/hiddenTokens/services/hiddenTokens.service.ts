import { UtilsShared } from "../../../shared/utils/utils.shared";
import { GeneralService } from "../../general/services/general.service";
import { UserEntity } from "../../users/entities/user.entity";
import { HiddenTokensLimitEntity } from "../entities/hiddenTokensLimit.entity";

export class HiddenTokensService {
  private generalService: GeneralService;

  constructor() {
    this.generalService = new GeneralService();
  }

  public getHiddenTokensByDefixId = async (defixId: string) => {
    try {
      const cryptos = await this.generalService.getCryptos();

      const datos = [];

      for (let crypto of cryptos) {
        if (crypto.limit_order) {
          for (let token of crypto.tokens) {
            datos.push(token);
          }
        }
      }
      // const cryptos = await HiddenTokensLimitEntity.findOneBy({
      //   user: { defixId: defixId },
      //   blockchain,
      // });
      return datos;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };
}
