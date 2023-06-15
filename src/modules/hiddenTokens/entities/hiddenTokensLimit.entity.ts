import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "hidden_tokens_limit" })
export class HiddenTokensLimitEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    nullable: false,
  })
  user!: string;

  @Column({
    name: "token_id",
    nullable: false,
  })
  tokenId!: number;
}
