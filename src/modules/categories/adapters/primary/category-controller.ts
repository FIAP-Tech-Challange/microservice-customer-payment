import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Request,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { CategoryInputPort } from '../../ports/input/category.port';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { CategoryService } from '../../services/category.service';
import {
  CategoryResponseDto,
  ProductResponseDto,
} from '../../models/dto/category-response.dto';
import { CategoryMapper } from '../../models/category.mapper';
import { ProductMapper } from '../../models/product.mapper';

@ApiTags('categories')
@Controller('categories')
export class CategoryController implements CategoryInputPort {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of categories retrieved successfully',
  })
  async findAll(
    @Request() req: RequestFromStore,
  ): Promise<CategoryResponseDto[]> {
    const storeId = req.storeId;

    const categories = await this.categoryService.findAll(storeId);

    return categories.map((category) =>
      CategoryMapper.toSimplifiedDto(category),
    );
  }

  @Get(':id')
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The category was found successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async findById(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<CategoryResponseDto> {
    const storeId = req.storeId;
    const category = await this.categoryService.findById(id, storeId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return CategoryMapper.toSimplifiedDto(category);
  }

  @Post()
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The category has been successfully created',
  })
  async create(
    @Body('name') name: string,
    @Request() req: RequestFromStore,
  ): Promise<CategoryResponseDto> {
    const storeId = req.storeId;

    const category = await this.categoryService.create(name, storeId);

    return CategoryMapper.toSimplifiedDto(category);
  }

  @Delete(':id')
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The category has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async delete(id: string, req: RequestFromStore): Promise<void> {
    const storeId = req.storeId;
    await this.categoryService.delete(id, storeId);
  }

  @Post(':categoryId/products')
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
  async createProduct(
    @Param('categoryId') categoryId: string,
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestFromStore,
  ): Promise<ProductResponseDto> {
    const storeId = req.storeId;

    const product = await this.categoryService.createProduct(
      categoryId,
      storeId,
      createProductDto,
    );

    return ProductMapper.toSimplifiedDto(product);
  }

  @Delete(':categoryId/products/:productId')
  @UseGuards(StoreGuard)
  @ApiOperation({ summary: 'Delete a product from a category' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The product has been successfully deleted',
  })
  async deleteProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const storeId = req.storeId;

    await this.categoryService.removeProduct(categoryId, storeId, productId);
  }
}
