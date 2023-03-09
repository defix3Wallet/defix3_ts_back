import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "subscriptions" })
export class SubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email!: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date;
}
