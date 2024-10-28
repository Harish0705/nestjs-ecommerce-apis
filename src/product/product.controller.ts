import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { Roles } from '../auth/get-roles.decorator';
import { RolesGuard } from '../auth/auth.roles.guard';
import { UserRole } from '../user/user-roles.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProducts(@Query() filterProductDTO: FilterProductDTO) {
    if (Object.keys(filterProductDTO).length) {
      const filteredProducts =
        await this.productService.getFilteredProducts(filterProductDTO);
      return filteredProducts;
    } else {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    }
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Post('/')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async addProduct(@Body() createProductDTO: CreateProductDTO) {
    const product = await this.productService.addProduct(createProductDTO);
    return product;
  }

  @Put('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDTO: CreateProductDTO,
  ) {
    const product = await this.productService.updateProduct(
      id,
      createProductDTO,
    );
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}
