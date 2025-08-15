import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { env } from '../../env';

@Injectable()
export class CookieService {
  private readonly jwtCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  setJwtCookie(
    response: Response,
    jwt: string,
    jwtExpires?: Date | undefined | null,
  ): void {
    response.cookie(env.jwtName, jwt, {
      ...this.jwtCookieOptions,
      expires: jwtExpires || undefined,
    });
  }

  setJwtRefreshCookie(
    response: Response,
    jwtRefresh: string,
    jwtRefreshExpires?: Date | undefined | null,
  ): void {
    response.cookie(env.jwtRefreshName, jwtRefresh, {
      ...this.jwtCookieOptions,
      expires: jwtRefreshExpires || undefined,
      path: '/api/v1/auth/refresh-token',
    });
    response.cookie(env.jwtRefreshFlagName, true, {
      expires: jwtRefreshExpires || undefined,
    });
  }

  unsetJwtCookie(response: Response): void {
    response.cookie(env.jwtName, '', {
      ...this.jwtCookieOptions,
      expires: new Date(0),
    });
  }

  unsetJwtRefreshCookie(response: Response): void {
    response.cookie(env.jwtRefreshName, '', {
      ...this.jwtCookieOptions,
      expires: new Date(0),
      path: '/api/v1/auth/refresh-token',
    });
    response.cookie(env.jwtRefreshFlagName, true, {
      expires: new Date(0),
    });
  }
}
