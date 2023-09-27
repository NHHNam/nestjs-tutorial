import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { UserEntity } from '../user/user.model';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @Column({ length: 100 })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column()
  photo: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;
}
