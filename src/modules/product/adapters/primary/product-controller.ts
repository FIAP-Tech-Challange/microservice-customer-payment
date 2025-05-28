import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';
import { ProductInputPort } from '../../ports/input/product.port';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../../services/product.service';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { ProductResponseDto } from '../../models/dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductController implements ProductInputPort {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The product has been successfully created',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestFromStore,
  ): Promise<ProductResponseDto> {
    const storeId = req.storeId;
    const product = await this.productService.create(createProductDto, storeId);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      is_active: product.is_active,
      description: product.description,
      prep_time: product.prep_time,
      image_url: product.image_url,
    };
  }

  @Get()
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of products retrieved successfully',
  })
  async findAll(
    @Request() req: RequestFromStore,
  ): Promise<ProductResponseDto[]> {
    const storeId = req.storeId;
    const products = await this.productService.findAll(storeId);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      is_active: product.is_active,
      description: product.description,
      prep_time: product.prep_time,
      image_url: product.image_url,
    }));
  }

  @Get(':id')
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product was found successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findById(@Param('id') id: string, @Request() req: RequestFromStore) {
    const storeId = req.storeId;
    const product = await this.productService.findById(id, storeId);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      is_active: product.is_active,
      description: product.description,
      prep_time: product.prep_time,
      image_url: product.image_url,
    };
  }

  @Patch(':id')
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: RequestFromStore,
  ) {
    const storeId = req.storeId;
    const product = await this.productService.update(
      id,
      updateProductDto,
      storeId,
    );

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      is_active: product.is_active,
      description: product.description,
      prep_time: product.prep_time,
      image_url: product.image_url,
    };
  }

  @Delete(':id')
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async remove(@Param('id') id: string, @Request() req: RequestFromStore) {
    const storeId = req.storeId;
    await this.productService.remove(id, storeId);
  }
}
