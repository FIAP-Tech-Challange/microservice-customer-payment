import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { CategoryInputPort } from '../../ports/input/category.port';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { CategoryService } from '../../services/category.service';
import {
  CategoryResponseDto,
  ProductResponseDto,
} from '../../models/dto/category-response.dto';
import { CategoryMapper } from '../../models/category.mapper';
import { ProductMapper } from '../../models/product.mapper';
import { BusinessException } from 'src/shared/dto/business-exception.dto';

@ApiTags('Category')
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController implements CategoryInputPort {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'List of categories not found',
    type: BusinessException,
  })
  @ApiOperation({
    summary: 'Retrieve all categories',
    description:
      'Retrieves the Categories based on the storeId contained in the accessToken (JWT).',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get()
  async findAll(
    @Request() req: RequestFromStore,
  ): Promise<CategoryResponseDto[]> {
    const storeId = req.storeId;

    const categories = await this.categoryService.findAll(storeId);

    return categories.map((category) =>
      CategoryMapper.toSimplifiedDto(category),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'The category was found successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: BusinessException,
  })
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: RequestFromStore,
  ): Promise<CategoryResponseDto> {
    const storeId = req.storeId;
    const category = await this.categoryService.findById(id, storeId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return CategoryMapper.toSimplifiedDto(category);
  }

  @ApiResponse({
    status: 200,
    description: 'The category has been successfully created',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The category has not been created',
    type: BusinessException,
  })
  @ApiBody({
    description: 'Name the category',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Sobremesa',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Post()
  async create(
    @Body('name') name: string,
    @Request() req: RequestFromStore,
  ): Promise<CategoryResponseDto> {
    const storeId = req.storeId;

    const category = await this.categoryService.create(name, storeId);

    return CategoryMapper.toSimplifiedDto(category);
  }

  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID category',
    example: '44226bf5-0187-4d7b-b649-e460fda43b01',
    required: true,
  })
  @ApiOperation({ summary: 'Delete a category' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const storeId = req.storeId;
    await this.categoryService.delete(id, storeId);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been successfully created',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Product has not been created',
    type: BusinessException,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'categoryId',
    type: String,
    description: 'ID category',
    example: '44226bf5-0187-4d7b-b649-e460fda43b01',
    required: true,
  })
  @ApiBody({
    description: 'Product data',
    type: CreateProductDto,
  })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Post(':categoryId/products')
  async createProduct(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestFromStore,
  ): Promise<ProductResponseDto> {
    try {
      const storeId = req.storeId;

      const product = await this.categoryService.createProduct(
        categoryId,
        storeId,
        createProductDto,
      );

      return ProductMapper.toSimplifiedDto(product);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Product has not been created',
    type: BusinessException,
  })
  @ApiParam({
    name: 'categoryId',
    type: String,
    description: 'ID category',
    example: '44226bf5-0187-4d7b-b649-e460fda43b01',
    required: true,
  })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'ID product',
    example: '44226bf5-0187-4d7b-b649-e460fda43b01',
    required: true,
  })
  @ApiOperation({ summary: 'Delete a product from a category' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Delete(':categoryId/products/:productId')
  async deleteProduct(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const storeId = req.storeId;

    await this.categoryService.removeProduct(categoryId, storeId, productId);
  }
}
