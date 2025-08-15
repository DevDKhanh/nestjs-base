import { Env, getEnvironment } from '@pietrobassi/environment';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Algorithm as JwtAlgorithm } from 'jsonwebtoken';
import * as ms from 'ms';

export class CommonAppEnvironment {
  @Env()
  @IsNumber()
  @Transform((prop) => Number(prop.value))
  port: number;

  @Env()
  @IsString()
  jwtPublicKey: string;

  @Env()
  @IsString()
  @Transform((prop) => prop.value.replace(/\\n/g, '\n'))
  jwtPrivateKey: string;

  @Env()
  @IsString()
  @Transform((prop) => prop.value.replace(/\\n/g, '\n'))
  jwtRefreshPrivateKey: string;

  @Env()
  @IsString()
  @Transform((prop) => prop.value.replace(/\\n/g, '\n'))
  jwtRefreshPublicKey: string;

  @Env()
  @IsNumber()
  @Transform((prop) => ms(prop.value))
  jwtExpireAfterMs: number;

  @Env()
  @IsNumber()
  @Transform((prop) => ms(prop.value))
  jwtRefreshExpireAfterMs: number;

  @Env()
  @IsString()
  jwtRefreshName: string = 'jwtRefresh';

  @Env()
  @IsString()
  jwtRefreshFlagName: string = 'jwtRefreshFlag';

  @Env()
  @IsString()
  dbHost: string;

  @Env()
  @IsNumber()
  @Transform((prop) => Number(prop.value))
  dbPort: number;

  @Env()
  @IsString()
  dbUsername: string;

  @Env()
  @IsString()
  dbPassword: string;

  @Env()
  @IsString()
  dbName: string;

  @Env()
  @IsString()
  @Transform((prop) => prop.value.replace(/\\n/g, '\n'))
  jwtAlgorithm: JwtAlgorithm = 'ES512';

  @Env()
  @IsString()
  jwtName: string = 'jwt';

  @Env()
  @IsString()
  redisHost: string;

  @Env()
  @IsNumber()
  @Type(() => Number)
  redisPort: number;

  @Env()
  @IsString()
  @IsOptional()
  redisPassword: string;
}

export const env = getEnvironment<CommonAppEnvironment>(CommonAppEnvironment, {
  envFilePath: '.env',
  loadEnvFile: true,
});
