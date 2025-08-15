import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { HandlerResultInterceptor } from './common/handler-result.interceptor';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory(validationError: ValidationError[]) {
        return new BadRequestException(
          validationError.map((error) => ({
            [error.property]: Object.values(error.constraints as any)[0],
          })),
        );
      },
    }),
  );
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Headers, Origin, Authorization',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  });

  const configDocs = new DocumentBuilder()
    .setTitle('API N8 ADMIN')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentV1 = SwaggerModule.createDocument(app, configDocs);
  SwaggerModule.setup('swagger', app, documentV1, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      urls: [
        {
          name: 'API V1 (Admin)',
          url: '/api/swagger.json',
        },
      ],
    },
    jsonDocumentUrl: '/api/swagger.json',
  });

  await app.listen(env.port);
  console.log('Swagger Running: http://localhost:' + env.port + '/swagger');
}
bootstrap();
