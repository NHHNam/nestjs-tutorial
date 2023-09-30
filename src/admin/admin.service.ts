import { Inject, Injectable } from '@nestjs/common';
import { PostDTO } from 'src/post/post.dto';
import { PostService } from 'src/post/post.service';
import { UserDTO } from 'src/user/user.dto';
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

  async getAllUsers(): Promise<Array<UserDTO>> {
    return await this.userService.findAll();
  }

  async getUserById(id: string): Promise<UserDTO> {
    return await this.userService.findOne(id);
  }

  async createUser(data: any): Promise<UserDTO> {
    return await this.userService.create(data);
  }

  async updateUser(id: string, data: any): Promise<string> {
    return await this.userService.update(id, data);
  }

  async deleteUser(id: string): Promise<string> {
    return await this.userService.delete(id);
  }
}
