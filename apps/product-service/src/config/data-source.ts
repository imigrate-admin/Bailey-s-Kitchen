import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Product } from '../modules/products/entities/product.entity';
import { join } from 'path';

// Load environment variables from .env file
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'postgres'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'product_service'),
  entities: [Product],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  migrationsRun: true,
  synchronize: false,
  logging: true,
}); 