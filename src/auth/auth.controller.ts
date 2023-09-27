import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshDTO } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async Login(@Body() user: UserDTO): Promise<any> {
    return { status: 200, metadata: await this.authService.login(user) };
  }

  @Post('register')
  async Register(@Body() user: UserDTO): Promise<any> {
    return { status: 201, metadata: await this.authService.register(user) };
  }

  @Post('refresh')
  async Refresh(@Body() data: RefreshDTO): Promise<string> {
    return await this.authService.refresh(data.refreshToken);
  }
}
