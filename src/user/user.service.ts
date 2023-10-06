import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { IBaseService } from '../common/base.service';
import { UserDTO } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PostService } from '../post/post.service';
import { PostDTO } from '../post/post.dto';

@Injectable()
export class UserService implements IBaseService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
  ) {}
  async findAll(): Promise<Array<UserDTO>> {
    return await this.userRepository.find();
  }
  async findOne(id: any): Promise<UserDTO> {
    return await this.userRepository.findOne({ where: { id: id } });
  }
  async create(data: UserDTO): Promise<any> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }
  async update(id: any, data: any): Promise<string> {
    if (data.password) {
      data = {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      };
    }

    await this.userRepository.update(id, data);
    return 'Udpate user successfully';
  }
  async delete(id: any): Promise<string> {
    await this.userRepository.delete(id); // maybe softDelete
    return 'Delete user successfully';
  }

  async findByEmail(email: string): Promise<UserDTO> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async getPotsByUserId(idUser: string): Promise<Array<PostDTO>> {
    const user = await this.findOne(idUser);
    if (!user) throw new ForbiddenException('User not found');

    return await this.postService.findAllByUserId(idUser);
  }
}
