import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

// Alternative to jwtRefreshFlag, but can't be used when refresh token Path=/api/auth/refresh.
// NOT IN USE FOR THIS PROJECT, kept here for future reference.
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.cause,
      skipRefresh: !request.cookies.jwtRefresh,
    });
  }
}
