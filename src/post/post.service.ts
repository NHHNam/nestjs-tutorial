import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { IBaseService } from '../common/base.service';
import { PostDTO } from './post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.model';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService implements IBaseService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}
  async findAll(page = 1, show = 10): Promise<Array<PostDTO>> {
    return await this.postRepository.find({
      relations: ['user'],
      skip: (page - 1) * show,
      take: show,
    });
  }
  async findOne(id: string): Promise<PostDTO> {
    return await this.postRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }
  async create(data: any): Promise<any> {
    const user = await this.userService.findOne(data.idUser);
    if (!user) throw new ForbiddenException('User not found');

    const post = new PostEntity();
    post.title = data.data.title;
    post.description = data.data.description;
    post.photo = data.data.photo;
    post.user = user;

    // Save the post
    return this.postRepository.save(post);
  }
  async update(id: any, data: any): Promise<string> {
    const post = await this.postRepository.findOne({ where: { id: id } });
    if (!post) throw new ForbiddenException('Post not found');
    await this.postRepository.update(id, data);
    return 'Update post successfully';
  }
  async delete(id: any): Promise<string> {
    await this.postRepository.delete(id); // maybe softDelete
    return 'Delete post successfully';
  }

  async findAllByUserId(idUser: string): Promise<Array<PostDTO>> {
    return await this.postRepository.find({
      where: { user: { id: idUser } },
    });
  }
}
