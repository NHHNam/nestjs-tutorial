import { IsNotEmpty, Length } from 'class-validator';
import { Expose } from 'class-transformer';
import { IBaseDTO } from '../common/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from 'src/post/post.model';
import { PaymentEntity } from 'src/payment/payment.model';
import { BillEntity } from 'src/bill/bill.model';

export class UserDTO extends IBaseDTO {
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Length(6, 20)
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  role: string;

  isActive: boolean;

  // @ApiProperty({ type: () => [PostEntity] })
  posts: PostEntity[];

  payment: PaymentEntity;

  bills: BillEntity[];

  hashPassowrd: () => Promise<void>;
}
