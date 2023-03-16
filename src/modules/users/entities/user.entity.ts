import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

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
    name: "flag_send",
    nullable: true,
  })
  flagSend!: boolean;

  @Column({
    name: "flag_receive",
    nullable: true,
  })
  flagReceive!: boolean;

  @Column({
    name: "flag_dex",
    nullable: true,
  })
  flagDex!: boolean;

  @Column({
    name: "flag_fiat",
    nullable: true,
  })
  flagFiat!: boolean;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date;
}
