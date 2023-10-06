import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshDTO } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async Login(@Body() user: UserDTO): Promise<any> {
    return { status: 200, metadata: await this.authService.login(user) };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  async Register(@Body() user: UserDTO): Promise<any> {
    return { status: 201, metadata: await this.authService.register(user) };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  async Refresh(@Body() data: RefreshDTO): Promise<string> {
    return await this.authService.refresh(data.refreshToken);
  }
}
