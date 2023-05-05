import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "hidden_tokens_limit" })
export class HiddenTokensLimitEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => UserEntity)
  token!: UserEntity;
}
