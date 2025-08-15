import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefeshTokenDto } from './dto/refesh-token.dto';
import { RequireUser } from 'src/core/decorators/require-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto, @Req() req: any) {
    return this.authService.login(loginAuthDto);
  }

  @Post('/refresh-token')
  refreshToken(@Body() body: RefeshTokenDto) {
    return this.authService.refreshToken(body);
  }
}
