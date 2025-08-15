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
import { LoggerMiddleware } from './core/middleware/logger.middleware';

import { RefeshTokenModule } from './modules/refesh-token/refesh-token.module';
import { DeviceInfoMiddleware } from './core/middleware/device-info.middleware';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { env } from './env';
import { SharedModule } from './core/shared/shared.module';
import { ContextGuard } from './guards/context.guard';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { HandlerResultInterceptor } from './common/handler-result.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: env.dbHost,
        port: env.dbPort,
        database: env.dbName,
        username: env.dbUsername,
        password: env.dbPassword,
        synchronize: process.env.NODE != 'production',
        migrationsRun: false,
        autoLoadEntities: true,
        entities: ['dist/**/*.entity.{ts,js}'],
        retryAttempts: 5,
        timezone: '+07:00',
        charset: 'utf8mb4_unicode_ci',
      }),
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
      useClass: ContextGuard,
    },
    {
      provide: APP_GUARD,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: HandlerResultInterceptor,
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
