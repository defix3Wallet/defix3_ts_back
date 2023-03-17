import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "frequent" })
export class FrequentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Column({
    name: "frequent_user",
    nullable: true,
  })
  frequentUser!: string;

  @Column({
    name: "type_transaction",
    nullable: true,
  })
  typeTxn!: string;
}
