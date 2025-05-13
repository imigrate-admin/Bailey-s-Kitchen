import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PetCategory } from '../entities/product.entity';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with at most 2 decimal places' })
  @Min(0, { message: 'Price must be a positive number' })
  @IsOptional()
  price?: number;

  @IsEnum(PetCategory, { message: 'Invalid pet category' })
  @IsOptional()
  category?: PetCategory;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be a positive number' })
  @IsOptional()
  stock?: number;
}

