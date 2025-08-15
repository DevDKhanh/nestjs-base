import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/env';
import { ClsModule } from 'nestjs-cls';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      publicKey: env.jwtPublicKey,
      privateKey: env.jwtPrivateKey,
      signOptions: { algorithm: env.jwtAlgorithm },
      verifyOptions: { algorithms: [env.jwtAlgorithm] },
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
    ClsModule.forRoot({
      global: true,
      guard: {
        mount: true,
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class SharedModule {}
