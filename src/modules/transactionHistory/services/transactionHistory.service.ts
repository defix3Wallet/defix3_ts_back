import { UtilsShared } from "../../../shared/utils/utils.shared";
import { UserEntity } from "../../users/entities/user.entity";
import { TransactionHistoryEntity } from "../entities/transactionHistory.entity";

export class TransactionHistoryService {
  public createTransactionHistory = async ({
    fromDefix,
    toDefix,
    fromAddress,
    toAddress,
    blockchain,
    coin,
    amount,
    hash,
    typeTxn,
  }: TransactionHistoryEntity) => {
    try {
      const transactionHistory = new TransactionHistoryEntity();

      transactionHistory.fromDefix = fromDefix;
      transactionHistory.toDefix = toDefix;
      transactionHistory.fromAddress = fromAddress;
      transactionHistory.toAddress = toAddress;
      transactionHistory.blockchain = blockchain;
      transactionHistory.coin = coin;
      transactionHistory.amount = amount;
      transactionHistory.hash = hash;
      transactionHistory.typeTxn = typeTxn;

      return await transactionHistory.save();
    } catch (err) {
      throw new Error(`Failed to create address: ${err}`);
    }
  };

  public getTransactionHistory = async (
    defixId: string,
    coin: string | null = null,
    blockchain: string | null = null,
    hash: string | null = null,
    typeTxn: string | null = null,
    year: string | null = null
  ) => {
    try {
      const transactions = await TransactionHistoryEntity.createQueryBuilder(
        "transaction"
      )
        .where(
          "(transaction.fromDefix = :defixId OR transaction.toDefix = :defixId) \
          AND (transaction.coin = :coin IS NULL OR transaction.coin = :coin) \
          AND (transaction.blockchain = :blockchain IS NULL OR transaction.blockchain = :blockchain) \
          AND (transaction.hash = :hash IS NULL OR transaction.hash = :hash) \
          AND (transaction.typeTxn = :typeTxn IS NULL OR transaction.typeTxn = :typeTxn) \
          AND DATE(createdAt) < '2023-01-01'",
          {
            defixId,
            coin,
            blockchain,
            hash,
            typeTxn,
            year,
          }
        )
        .getMany();

      return transactions;
    } catch (err) {
      throw new Error(`Failed to get address: ${err}`);
    }
  };
}
