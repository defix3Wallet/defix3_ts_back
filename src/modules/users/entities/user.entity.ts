import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "defix_id",
    nullable: false,
    unique: true,
  })
  defixId!: string;

  @Column({
    nullable: true,
    unique: true,
  })
  email!: string;

  @Column({
    name: "import_id",
    nullable: false,
    unique: true,
  })
  importId!: string;

  @Column({
    nullable: true,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  lastname!: string;

  @Column({
    nullable: true,
  })
  avatar!: string;

  @Column({
    name: "close_sessions",
    nullable: true,
    default: false,
  })
  closeSessions!: boolean;

  @Column({
    nullable: true,
    default: false,
  })
  twofa!: boolean;

  @Column({
    name: "legal_document",
    nullable: true,
    unique: true,
  })
  legalDocument!: string;

  @Column({
    name: "type_document",
    nullable: true,
  })
  typeDocument!: string;

  @Column({
    nullable: true,
  })
  secret!: string;

  @Column({
    name: "flag_news",
    nullable: true,
  })
  flagNews!: boolean;

  @Column({
    name: "flag_deposit",
    nullable: true,
  })
  flagDeposit!: boolean;

  @Column({
    name: "flag_sign",
    nullable: true,
  })
  flagSign!: boolean;

  @Column({
    name: "flag_withdrawal",
    nullable: true,
  })
  flagWithdraw!: boolean;

  @Column({
    name: "flag_evolution",
    nullable: true,
  })
  flagEvolution!: boolean;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date;
}
