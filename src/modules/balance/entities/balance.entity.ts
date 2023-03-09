import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "balances" })
export class BalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Column({
    nullable: true,
  })
  blockchain!: string;

  @Column({
    nullable: true,
  })
  coin!: string;

  @Column({
    nullable: true,
    type: "float",
    default: 0,
  })
  balance!: number;
}
