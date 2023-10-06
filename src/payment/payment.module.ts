import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { PaymentEntity } from './payment.model';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UserEntity } from 'src/user/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, UserEntity]),
    forwardRef(() => UserModule),
    MulterModule.register({
      dest: './public', // Define the destination folder for uploaded files
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService], // Export the PostService
})
export class PaymentModule {}
