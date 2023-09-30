import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.model';
import { PostService } from './post.service';
import { UserEntity } from '../user/user.model';
import { UserModule } from '../user/user.module';

describe('PostService', () => {
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
          entities: [UserEntity, PostEntity],
          // synchronize: true,
        }),
        TypeOrmModule.forFeature([PostEntity]),
        UserModule,
      ],
      providers: [PostService],
    }).compile();

    postService = app.get<PostService>(PostService);
  });

  describe('check crud', () => {
    it('should return an array of posts', async () => {
      const result: any = [];

      jest.spyOn(postService, 'findAll').mockImplementation(() => result);
      expect(await postService.findAll()).toBe(result);
    });

    it('create post', async () => {
      const result: any = {
        id: '184069f0-024c-42f1-9d98-f549cb0510db',
        createdAt: '2023-09-21T21:04:58.796Z',
        updatedAt: '2023-09-21T21:04:58.796Z',
        deletedAt: null,
        email: 'nam1',
        password:
          '$2b$10$Ihrbv6uEVz9hmy.4cQ02duI2XBqv84DdWse1O9dutAVMh3RQ3rJr2',
        role: 'post',
        isActive: true,
      };

      jest.spyOn(postService, 'create').mockImplementation(() => result);
      expect(await postService.create({})).toBe(result);
    });

    it('update post', async () => {
      const result: any = 'Udpate post successfully';
      jest.spyOn(postService, 'update').mockImplementation(() => result);
      expect(
        await postService.update(result.id, { password: '212312321' }),
      ).toEqual('Udpate post successfully');
    });

    it('delete post', async () => {
      const result: any = 'Delete post successfully';
      jest.spyOn(postService, 'delete').mockImplementation(() => result);
      expect(
        await postService.delete('184069f0-024c-42f1-9d98-f549cb0510db'),
      ).toEqual(result);
    });
  });
});
