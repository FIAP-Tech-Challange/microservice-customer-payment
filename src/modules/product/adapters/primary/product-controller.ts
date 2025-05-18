import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';
import { ProductInputPort } from '../../ports/input/product.port';

@Controller('products')
export class ProductController {
  constructor(private readonly productInputPort: ProductInputPort) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productInputPort.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.productInputPort.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productInputPort.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productInputPort.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productInputPort.remove(id);
  }
}