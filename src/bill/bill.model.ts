import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { UserEntity } from '../user/user.model';

@Entity({ name: 'bills' })
export class BillEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ['topup', 'withdraw', 'others'],
    default: 'others',
  })
  typeBill: string;

  @Column({ type: 'float', default: 0 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.bills)
  user: UserEntity;
}
