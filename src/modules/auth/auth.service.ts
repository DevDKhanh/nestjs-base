import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { RefeshTokenService } from '../refesh-token/refesh-token.service';
import { RefeshTokenDto } from './dto/refesh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly refeshTokenService: RefeshTokenService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async token(payload: any) {
    try {
      const token = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_REFRESH'),
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      });

      await this.refeshTokenService.saveRefeshToken(payload.id, refreshToken);

      return {
        access_token: token,
        refresh_token: refreshToken,
      };
    } catch (error) {
      this.logger.error('Error generating token', error);
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const account = await this.accountsService.validateAccount(
      loginAuthDto.username,
      loginAuthDto.password,
    );

    if (!account) {
      return 'Tài khoản hoặc mật khẩu không đúng';
    }

    const token = await this.token(account);
    return {
      ...account,
      ...token,
    };
  }

  async refreshToken(body: RefeshTokenDto) {
    try {
      const { iat, exp, ...data } = await this.jwtService.decode(
        body.refeshToken,
      );
      const validateToken = await this.refeshTokenService.validateRefeshToken(
        data.id,
        body.refeshToken,
      );

      if (!validateToken) {
        return 'Refresh token không hợp lệ';
      }

      const verifyToken = await this.jwtService.verifyAsync(body.refeshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      });

      if (!verifyToken) {
        return 'Refresh token không thể xác thực';
      }

      const newToken = await this.token(data);
      return newToken;
    } catch (error) {
      this.logger.error('Error refreshing token', error);
      throw new InternalServerErrorException('Refresh token không hợp lệ');
    }
  }
}
