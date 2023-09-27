import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.model';
import { UserDTO } from './user.dto';

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
          entities: [UserEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  describe('check crud', () => {
    // it('should return an array of users', async () => {
    //   const users = await userService.findAll();

    //   const userObjects = users.map((user) => ({
    //     id: user.id,
    //     createdAt: user.createdAt.toISOString(), // Format as ISO string
    //     updatedAt: user.updatedAt.toISOString(), // Format as ISO string
    //     deletedAt: null, // Format as ISO string
    //     email: user.email,
    //     password: user.password,
    //     role: user.role,
    //     isActive: user.isActive,
    //   }));

    //   const dataCheck = [
    //     {
    //       id: '184069f0-024c-42f1-9d98-f549cb0510db',
    //       createdAt: '2023-09-21T21:04:58.796Z',
    //       updatedAt: '2023-09-21T21:04:58.796Z',
    //       deletedAt: null,
    //       email: 'nam1',
    //       password:
    //         '$2b$10$Ihrbv6uEVz9hmy.4cQ02duI2XBqv84DdWse1O9dutAVMh3RQ3rJr2',
    //       role: 'user',
    //       isActive: true,
    //     },
    //     {
    //       id: '1bc1e462-d122-4b32-8872-6b6068a6842a',
    //       createdAt: '2023-09-21T21:01:23.865Z',
    //       updatedAt: '2023-09-21T21:01:23.865Z',
    //       deletedAt: null,
    //       email: 'string',
    //       password:
    //         '$2b$10$vTGHVASOVm07aCie9YkiKuUZxcGtNDLQNAtohLdGztYA/4J1nyMpm',
    //       role: 'user',
    //       isActive: true,
    //     },
    //     {
    //       id: '4ccb1289-2ff6-4fb5-a69d-aa4105a8cd3c',
    //       createdAt: '2023-09-21T21:18:44.269Z',
    //       updatedAt: '2023-09-21T21:18:44.269Z',
    //       deletedAt: null,
    //       email: 'string2',
    //       password:
    //         '$2b$10$/YydLQUXVEAGLMRcD1oq.uv7nNXFl5b3yot65gpxSxlqz2lCVztfy',
    //       role: 'user',
    //       isActive: true,
    //     },
    //     {
    //       id: 'd498001c-a280-4e49-9115-a62e00301611',
    //       createdAt: '2023-09-21T21:02:57.817Z',
    //       updatedAt: '2023-09-21T21:02:57.817Z',
    //       deletedAt: null,
    //       email: 'nam',
    //       password:
    //         '$2b$10$9zd2ZFOI3ssi6urh9OjJ.uE5tiIIkzK67kBERuWKzTYWyTwBAKZci',
    //       role: 'user',
    //       isActive: true,
    //     },
    //   ];

    //   expect(userObjects).toEqual(dataCheck);
    // });

    it('create user', async () => {
      const userCreated: UserDTO = await userService.create(user);
      expect(userCreated.email).toEqual(user.email);
    });

    it('update user', async () => {
      const userFind = await userService.findByEmail(user.email);
      const userUpdate = await userService.update(userFind.id, {
        password: 'string2',
      });
      expect(userUpdate).toBe('Udpate user successfully');
    });

    it('delete user', async () => {
      const userFind = await userService.findByEmail(user.email);
      const userDeleted = await userService.delete(userFind.id);
      expect(userDeleted).toBe('Delete user successfully');
    });
  });
});
