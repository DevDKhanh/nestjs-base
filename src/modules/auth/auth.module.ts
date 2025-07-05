import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsModule } from '../accounts/accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { RefeshTokenModule } from '../refesh-token/refesh-token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [AccountsModule, RefeshTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
