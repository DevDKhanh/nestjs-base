import { Module } from '@nestjs/common';
import { RefeshTokenService } from './refesh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefeshToken } from './entities/refeshToken.entity';
import { Account } from '../accounts/entities/account.entity';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefeshToken]), AccountsModule],
  providers: [RefeshTokenService],
  exports: [RefeshTokenService],
})
export class RefeshTokenModule {}
