import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Product } from '../modules/products/entities/product.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  // Get database configuration from environment variables
  const host = configService.get<string>('DB_HOST', 'postgres');
  const port = configService.get<number>('DB_PORT', 5432);
  const username = configService.get<string>('DB_USERNAME', 'postgres');
  const password = configService.get<string>('DB_PASSWORD', 'postgres');
  const database = configService.get<string>('DB_DATABASE', 'product_service');
  const synchronize = configService.get<boolean>('DB_SYNCHRONIZE', true);
  const logging = configService.get<boolean>('DB_LOGGING', true);
  
  // Log database connection details (with masked password)
  console.log('Database Configuration:');
  console.log(`Host: ${host}`);
  console.log(`Port: ${port}`);
  console.log(`Username: ${username}`);
  console.log(`Database: ${database}`);
  console.log(`Synchronize: ${synchronize}`);
  console.log(`Logging: ${logging}`);
  
  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Product],
    synchronize,
    logging,
  };
};

