import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { SharedModule } from './shared/shared.module';
import { RefeshTokenModule } from './modules/refesh-token/refesh-token.module';
import { DeviceInfoMiddleware } from './middleware/device-info.middleware';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_DATABASE'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        synchronize: process.env.NODE != 'production',
        migrationsRun: false,
        autoLoadEntities: true,
        entities: ['dist/**/*.entity.{ts,js}'],
        retryAttempts: 5,
        timezone: '+07:00',
        charset: 'utf8mb4_unicode_ci',
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: minutes(1),
          limit: 20,
          blockDuration: minutes(1),
        },
      ],
      errorMessage:
        'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau ít phút',
    }),
    SharedModule,
    AccountsModule,
    AuthModule,
    RefeshTokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, DeviceInfoMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
