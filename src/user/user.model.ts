import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../common/base.entity';
import { PostEntity } from '../post/post.model';
import { PaymentEntity } from '../payment/payment.model';
import { BillEntity } from '../bill/bill.model';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 60, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ type: 'double', default: 0 })
  point: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => PostEntity, (post) => post.user, { nullable: true })
  posts: PostEntity[];

  @ManyToOne(() => PaymentEntity, (payment) => payment.users)
  payment: PaymentEntity;

  @OneToMany(() => BillEntity, (bill) => bill.user, { nullable: true })
  bills: BillEntity[];

  @BeforeInsert()
  public async hashPassowrd(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
