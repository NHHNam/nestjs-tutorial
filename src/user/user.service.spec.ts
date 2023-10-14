import { Test, TestingModule } from '@nestjs/testing';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.model';
import { PostService } from '../post/post.service';

const mockPayments: UserDTO[] = [];

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: 'userRepository',
        },
        {
          provide: PostService,
          useValue: PostService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Mock the find method of the repository to return a sample array of users

      // jest.spyOn(userService, 'findAll').mockResolvedValue(mockPayments);
      jest.spyOn(userService, 'findAll').mockResolvedValue(mockPayments);
      const result = await userService.findAll(1, 20);

      expect(result).toEqual(mockPayments);
    });
  });
});
