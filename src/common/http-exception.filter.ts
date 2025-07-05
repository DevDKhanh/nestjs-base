import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log(exception.response);

    const status = exception.getStatus
      ? exception.getStatus()
      : exception.status || 500;
    const errorResponse = {
      timestamp: new Date().toISOString() || new Date().toISOString(),
    };

    response.status(200).json({
      statusCode: status,
      message:
        exception?.response?.message ??
        exception?.response ??
        'Internal server error',
      timestamp: errorResponse.timestamp,
    });
  }
}
