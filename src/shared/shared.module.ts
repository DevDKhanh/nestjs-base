import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { JwtStrategy } from 'src/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new DailyRotateFile({
          filename: '/%DATE%-result.log',
          datePattern: 'YYYY-MM-DD',
          dirname: process.cwd() + '/logs',
          handleExceptions: true,
          json: false,
          zippedArchive: true,
        }),
        new winston.transports.Console(),
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class SharedModule {}
