import { Inject, Injectable } from '@nestjs/common';
import { BillCreateDTO, BillDTO } from 'src/bill/bill.dto';
import { BillService } from 'src/bill/bill.service';
import { PostDTO } from 'src/post/post.dto';
import { PostService } from 'src/post/post.service';
import { UserDTO } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(PostService) private readonly postService: PostService,
    @Inject(BillService) private readonly billService: BillService,
  ) {}

  async getAllPosts(page = 1, show = 10): Promise<Array<PostDTO>> {
    return await this.postService.findAll(page, show);
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

  async getAllUsers(page = 1, show = 10): Promise<Array<UserDTO>> {
    return await this.userService.findAll(page, show);
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

  async getAllBills(page = 1, show = 10): Promise<BillDTO[]> {
    return await this.billService.findAll(page, show);
  }

  async getBillById(id: string): Promise<BillDTO> {
    return await this.billService.findOne(id);
  }

  async createBill({
    idUser,
    data,
  }: {
    idUser: string;
    data: BillCreateDTO;
  }): Promise<BillDTO> {
    return await this.billService.create({ idUser, data });
  }

  async updateBill(id: string, data: any): Promise<string> {
    return await this.billService.update(id, data);
  }

  async deleteBill(id: string): Promise<string> {
    return await this.billService.delete(id);
  }
}
