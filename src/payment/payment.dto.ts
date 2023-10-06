import { Expose } from 'class-transformer';
import { IBaseDTO } from '../common/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../user/user.model';

export class PaymentDTO extends IBaseDTO {
  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  cardNumber: string;

  @Expose()
  @ApiProperty()
  nameBank: string;

  users: UserEntity[];
}

export class PaymentCreateDTO extends IBaseDTO {
  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  cardNumber: string;

  @Expose()
  @ApiProperty()
  nameBank: string;
}
