import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillEntity } from './bill.model';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BillEntity]), UserModule],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
