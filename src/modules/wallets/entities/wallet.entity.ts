import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "wallets" })
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column({
    nullable: true,
  })
  blockchain!: string;

  @Column({
    nullable: true,
  })
  address!: string;
}
