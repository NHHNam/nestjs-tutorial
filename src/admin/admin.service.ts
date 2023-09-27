import { Inject, Injectable } from '@nestjs/common';
import { PostDTO } from 'src/post/post.dto';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(PostService) private readonly postService: PostService,
  ) {}

  async getAllPosts(): Promise<Array<PostDTO>> {
    return await this.postService.findAll();
  }

  async getPostById(id: string): Promise<PostDTO> {
    return await this.postService.findOne(id);
  }

  async createPost(data: any): Promise<PostDTO> {
    return await this.postService.create(data);
  }

  async updatePost(id: string, data: any): Promise<string> {
    return await this.postService.update(id, data);
  }

  async deletePost(id: string): Promise<string> {
    return await this.postService.delete(id);
  }
}
