import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "adresses" })
export class AddressEntity extends BaseEntity {
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
  address!: string;
}
