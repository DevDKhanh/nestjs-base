import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '../modules/accounts/accounts.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private accountService: AccountsService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info): any {
    if (err || !user) {
      throw err || new UnauthorizedException('Không có quyền truy cập');
    }

    // Check if the user exists in the database
    const userFromDb = this.accountService.findById(user.id);
    if (!userFromDb) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user?.role,
    };
  }
}
