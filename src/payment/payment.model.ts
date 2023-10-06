import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { UserEntity } from '../user/user.model';

@Entity({ name: 'payments' })
export class PaymentEntity extends BaseEntity {
  @Column({ length: 100 })
  fullName: string;

  @Column({ nullable: false })
  cardNumber: string;

  @Column()
  nameBank: string;

  @OneToMany(() => UserEntity, (user) => user.payment, { nullable: true })
  users: UserEntity[];
}
