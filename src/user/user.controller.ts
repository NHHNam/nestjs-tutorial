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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Auth } from '../auth/auth.decorator';
import { Role } from '../enums/role.enum';
import { ResponseInterface } from '../cores/response.interface';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(@Inject(UserService) private userSerice: UserService) {}
  @Post('posts/:id')
  @ApiOperation({ summary: 'Get posts by user id' })
  async getPostsByUserId(@Param('id') id: string): Promise<ResponseInterface> {
    return {
      status: 200,
      metadata: await this.userSerice.getPotsByUserId(id),
    };
  }
}
