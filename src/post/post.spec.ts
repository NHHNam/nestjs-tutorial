import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostEntity } from './post.model';
import { PostDTO } from './post.dto';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserEntity } from '../user/user.model';
import { UserService } from '../user/user.service';

describe('Post service', () => {
  let postService: PostService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3309,
          username: 'root',
          password: 'root',
          database: 'testing',
          entities: [PostEntity, UserEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PostEntity]),
        MulterModule.register({
          dest: './public', // Define the destination folder for uploaded files
        }),
      ],
      providers: [PostService, UserService],
    }).compile();

    postService = app.get<PostService>(PostService);
  });

  describe('check crud', () => {
    it('should return an array of users', async () => {
      const posts = await postService.findAll();

      const userObjects = posts.map((post: PostDTO) => ({
        id: post.id,
        createdAt: post.createdAt.toISOString(), // Format as ISO string
        updatedAt: post.updatedAt.toISOString(), // Format as ISO string
        deletedAt: null, // Format as ISO string
        title: post.title,
        content: post.description,
        photo: post.photo,
      }));

      console.log(userObjects);
    });
  });
});
