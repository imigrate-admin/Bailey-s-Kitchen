import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PetCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Product description is required' })
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with at most 2 decimal places' })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsEnum(PetCategory, { message: 'Invalid pet category' })
  category: PetCategory;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be a positive number' })
  stock: number;
}

