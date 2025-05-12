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
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PetCategory, Product } from './entities/product.entity';

// Public decorator for endpoints that don't require authentication
export const Public = () => SetMetadata('isPublic', true);

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Protected route - requires authentication
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  // Public route - no authentication required
  @Public()
  @Get()
  findAll(@Query('category') category?: PetCategory): Promise<Product[]> {
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  // Public route - no authentication required
  @Public()
  @Get('search')
  search(@Query('q') query: string): Promise<Product[]> {
    return this.productsService.searchProducts(query);
  }

  // Public route - no authentication required
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // Protected route - requires authentication
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  // Protected route - requires authentication
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}

