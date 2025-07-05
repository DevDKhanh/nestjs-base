import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RefeshTokenDto } from './dto/refesh-token.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({})
  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto, @Req() req: any) {
    return this.authService.login(loginAuthDto);
  }

  @Post('/refresh-token')
  refreshToken(@Body() body: RefeshTokenDto) {
    return this.authService.refreshToken(body);
  }
}
