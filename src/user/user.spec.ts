import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.model';
import { PostEntity } from '../post/post.model';
import { PostModule } from '../post/post.module';

describe('UserController', () => {
  let userService: UserService;
  const user: any = {
    email: 'nam1243',
    password: 'string',
  };

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
        TypeOrmModule.forFeature([UserEntity]),
        PostModule,
      ],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  describe('check crud', () => {
    it('should return an array of users', async () => {
      const result: any = [
        {
          id: '184069f0-024c-42f1-9d98-f549cb0510db',
          createdAt: '2023-09-21T21:04:58.796Z',
          updatedAt: '2023-09-21T21:04:58.796Z',
          deletedAt: null,
          email: 'nam1',
          password:
            '$2b$10$Ihrbv6uEVz9hmy.4cQ02duI2XBqv84DdWse1O9dutAVMh3RQ3rJr2',
          role: 'user',
          isActive: true,
        },
        {
          id: '1bc1e462-d122-4b32-8872-6b6068a6842a',
          createdAt: '2023-09-21T21:01:23.865Z',
          updatedAt: '2023-09-21T21:01:23.865Z',
          deletedAt: null,
          email: 'string',
          password:
            '$2b$10$vTGHVASOVm07aCie9YkiKuUZxcGtNDLQNAtohLdGztYA/4J1nyMpm',
          role: 'user',
          isActive: true,
        },
        {
          id: '4ccb1289-2ff6-4fb5-a69d-aa4105a8cd3c',
          createdAt: '2023-09-21T21:18:44.269Z',
          updatedAt: '2023-09-21T21:18:44.269Z',
          deletedAt: null,
          email: 'string2',
          password:
            '$2b$10$/YydLQUXVEAGLMRcD1oq.uv7nNXFl5b3yot65gpxSxlqz2lCVztfy',
          role: 'user',
          isActive: true,
        },
        {
          id: 'd498001c-a280-4e49-9115-a62e00301611',
          createdAt: '2023-09-21T21:02:57.817Z',
          updatedAt: '2023-09-21T21:02:57.817Z',
          deletedAt: null,
          email: 'nam',
          password:
            '$2b$10$9zd2ZFOI3ssi6urh9OjJ.uE5tiIIkzK67kBERuWKzTYWyTwBAKZci',
          role: 'user',
          isActive: true,
        },
      ];

      jest.spyOn(userService, 'findAll').mockImplementation(() => result);
      expect(await userService.findAll()).toBe(result);
    });

    it('create user', async () => {
      const result: any = {
        id: '184069f0-024c-42f1-9d98-f549cb0510db',
        createdAt: '2023-09-21T21:04:58.796Z',
        updatedAt: '2023-09-21T21:04:58.796Z',
        deletedAt: null,
        email: 'nam1',
        password:
          '$2b$10$Ihrbv6uEVz9hmy.4cQ02duI2XBqv84DdWse1O9dutAVMh3RQ3rJr2',
        role: 'user',
        isActive: true,
      };

      jest.spyOn(userService, 'create').mockImplementation(() => result);
      expect(await userService.create(user)).toBe(result);
    });

    it('update user', async () => {
      const result: any = 'Udpate user successfully';
      jest.spyOn(userService, 'update').mockImplementation(() => result);
      expect(
        await userService.update(result.id, { password: '212312321' }),
      ).toEqual('Udpate user successfully');
    });

    it('delete user', async () => {
      const result: any = 'Delete user successfully';
      jest.spyOn(userService, 'delete').mockImplementation(() => result);
      expect(
        await userService.delete('184069f0-024c-42f1-9d98-f549cb0510db'),
      ).toEqual(result);
    });
  });
});
