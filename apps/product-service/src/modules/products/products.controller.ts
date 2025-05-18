import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
  SetMetadata,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PetCategory, Product } from './entities/product.entity';

// Public decorator for endpoints that don't require authentication
export const Public = () => SetMetadata('isPublic', true);

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query('category') category?: string): Promise<Product[]> {
    if (category) {
      // Convert category to uppercase and validate it's a valid PetCategory
      const upperCategory = category.toUpperCase();
      if (!Object.values(PetCategory).includes(upperCategory as PetCategory)) {
        throw new BadRequestException(`Invalid category: ${category}`);
      }
      return this.productsService.findByCategory(upperCategory as PetCategory);
    }
    return this.productsService.findAll();
  }

  @Public()
  @Get('search')
  search(
    @Query('q') query: string,
    @Query('category') category?: string
  ): Promise<Product[]> {
    let validCategory: PetCategory | undefined;
    if (category) {
      // Convert category to uppercase and validate it's a valid PetCategory
      const upperCategory = category.toUpperCase();
      if (!Object.values(PetCategory).includes(upperCategory as PetCategory)) {
        throw new BadRequestException(`Invalid category: ${category}`);
      }
      validCategory = upperCategory as PetCategory;
    }
    return this.productsService.searchProducts(query, validCategory);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
