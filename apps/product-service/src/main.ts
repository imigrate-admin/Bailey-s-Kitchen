import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Get port and API prefix from environment
  const port = configService.get<number>('PORT', 5003);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  
  // Set global prefix for all routes
  app.setGlobalPrefix(apiPrefix);
  
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Parse CORS origins and use only the first one to avoid multiple headers
  const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000').split(',').map(origin => origin.trim());
  const primaryOrigin = corsOrigins[0];

  // Enable CORS
  app.enableCors({
    origin: primaryOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);
  console.log(`Product service is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`CORS enabled for origin: ${primaryOrigin}`);
}

bootstrap();
