import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';
import { ProductInputPort } from '../../ports/input/product.port';
import { PRODUCT_INPUT_PORT } from '../../product.tokens';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_INPUT_PORT)
    private readonly productInputPort: ProductInputPort,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productInputPort.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.productInputPort.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productInputPort.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productInputPort.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.productInputPort.remove(id);
  }
}