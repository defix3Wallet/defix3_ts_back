import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "transaction_history" })
export class TransactionHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "from_defix",
    nullable: false,
  })
  fromDefix!: string;

  @Column({
    name: "to_defix",
    nullable: false,
  })
  toDefix!: string;

  @Column({
    name: "from_address",
    nullable: false,
  })
  fromAddress!: string;

  @Column({
    name: "to_address",
    nullable: false,
  })
  toAddress!: string;

  @Column({
    nullable: false,
  })
  blockchain!: string;

  @Column({
    nullable: false,
  })
  coin!: string;

  @Column({
    nullable: false,
    type: "float",
  })
  amount!: number;

  @Column({
    nullable: false,
  })
  hash!: string;

  @Column({
    name: "type_txn",
    nullable: false,
  })
  typeTxn!: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;
}
