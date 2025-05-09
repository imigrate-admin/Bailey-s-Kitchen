import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Get configuration values
  const port = configService.get<number>('PORT', 5002);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  
  // Set global prefix
  app.setGlobalPrefix(apiPrefix);
  
  // Enable CORS
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });
  
  // Set global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  await app.listen(port);
  console.log(`User service is running on: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
