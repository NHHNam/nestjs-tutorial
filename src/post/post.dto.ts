import { Post } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IBaseDTO } from '../common/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/user.model';

export class PostDTO extends IBaseDTO {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  photo: string;

  user: UserEntity;
}

export class PostCreateDTO extends IBaseDTO {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({ type: 'string', format: 'binary' }) // Use type: 'string' and format: 'binary' for file uploads
  photo: Buffer; // Use Buffer to store binary data

  user: UserEntity;
}
