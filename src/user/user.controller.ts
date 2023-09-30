import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/auth/role/roles.guard';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/enums/role.enum';
import { ResponseInterface } from 'src/cores/response.interface';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private userSerice: UserService) {}

  @Get()
  async findAll(): Promise<any> {
    return {
      status: 200,
      metada: await this.userSerice.findAll(),
    };
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    description: 'List of cats',
    type: UserDTO,
  })
  @Auth(Role.Admin) // bao gom check token va check role
  @UseGuards(AuthGuard) // chi check token
  async create(@Body() data: UserDTO): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.userSerice.create(data),
    };
  }

  @Get('posts/:id')
  async getPostsByUserId(@Param('id') id: string): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.userSerice.getPotsByUserId(id),
    };
  }
}
