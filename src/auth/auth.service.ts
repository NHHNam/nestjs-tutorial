import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.model';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(data: UserDTO): Promise<any> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user)
      throw new BadGatewayException('username or passowrd is not exist');

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw new BadGatewayException('Password is not true');
    }

    const payload = { idUser: user.id, email: user.email };

    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: UserDTO): Promise<any> {
    const checkEmail = await this.userService.findByEmail(data.email);
    if (checkEmail) throw new BadGatewayException('Email is exist');

    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async refresh(refreshToken: string): Promise<any> {
    const data = this.jwtService.decode(refreshToken);
    const payload = { idUser: data['idUser'], email: data['email'] };
    return await this.jwtService.signAsync(payload);
  }
}
