import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.model';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    forwardRef(() => UserModule),
    MulterModule.register({
      dest: './public', // Define the destination folder for uploaded files
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService], // Export the PostService
})
export class PostModule {}
