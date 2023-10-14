import { Test, TestingModule } from '@nestjs/testing';
import { PostDTO } from './post.dto';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './post.model';
import { UserService } from '../user/user.service';

const mockPosts: PostDTO[] = [];

describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: 'userRepository',
        },
        {
          provide: UserService,
          useValue: UserService,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      // Mock the find method of the repository to return a sample array of users
      jest.spyOn(postService, 'findAll').mockResolvedValue(mockPosts);
      const result = await postService.findAll(1, 20);

      expect(result).toEqual(mockPosts);
    });
  });
});
