import dbConnect from "../../../config/postgres";
import { UtilsShared } from "../../../shared/utils/utils.shared";

export class GeneralService {
  public getCryptos = async () => {
    try {
      return await UtilsShared.getCryptos();
    } catch (err) {
      throw new Error(`Failed to get cryptos: ${err}`);
    }
  };
  public getCryptosSwap = async () => {
    try {
      const conexion = await dbConnect();
      const cryptocurrencys = await conexion.query(
        "select * from backend_cryptocurrency where swap=true"
      );

      const cryptos = [];

      for (let cryptocurrency of cryptocurrencys.rows) {
        const tokens = await conexion.query(
          "select * from backend_token where cryptocurrency_id = $1",
          [cryptocurrency.id]
        );
        cryptocurrency.tokens = tokens.rows;
        cryptos.push(cryptocurrency);
      }

      return cryptos;
    } catch (err) {
      throw new Error(`Failed to get cryptos: ${err}`);
    }
  };
}
