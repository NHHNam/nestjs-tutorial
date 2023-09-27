import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RefreshDTO {
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
