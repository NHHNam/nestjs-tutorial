import { Expose } from 'class-transformer';

export abstract class IBaseDTO {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}
