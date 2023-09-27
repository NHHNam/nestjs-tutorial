import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PostModule } from 'src/post/post.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UserModule,
    PostModule,
    MulterModule.register({
      dest: './public', // Define the destination folder for uploaded files
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
