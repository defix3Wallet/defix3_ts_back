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
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.defix_id)
  user!: User;

  @Column({
    nullable: true,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  address!: string;
}
