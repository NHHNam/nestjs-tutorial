import { Expose } from 'class-transformer';
import { IBaseDTO } from '../common/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/user.model';

export class BillDTO extends IBaseDTO {
  @Expose()
  @ApiProperty()
  typeBill: string;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty()
  status: string;

  user: UserEntity;
}

export class BillCreateDTO extends IBaseDTO {
  @Expose()
  @ApiProperty({
    enum: ['topup', 'withdraw', 'others'],
    default: 'others',
  })
  typeBill: string;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty({
    enum: ['pending', 'completed', 'rejected', 'cancelled'],
    default: 'pending',
  })
  status: string;

  user: UserEntity;
}
