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
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from '.././dto/create-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import {
  CategoryResponseDto,
  ProductResponseDto,
} from '.././dto/category-response.dto';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { ProductCoreController } from 'src/core/modules/product/controllers/product.controller';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { StoreGuard } from '../../auth/guards/store.guard';
import { RequestFromStore } from '../../auth/dtos/request.dto';

@ApiTags('Category')
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private dataSource: DataSourceProxy) {}

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
    const coreController = new ProductCoreController(this.dataSource);

    const findCategories =
      await coreController.findAllCategoriesByStoreId(storeId);
    if (findCategories.error) {
      this.logger.error(
        `Error retrieving categories for store ${storeId}: ${findCategories.error.message}`,
      );
      throw new NotFoundException(findCategories.error.message);
    }
    this.logger.log(`Successfully retrieved categories for store ${storeId}`);
    return findCategories.value.map((category) => ({
      id: category.id,
      name: category.name,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        prepTime: product.prepTime,
        imageUrl: product.imageUrl,
      })),
    }));
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
    const coreController = new ProductCoreController(this.dataSource);
    const category = await coreController.findCategoryById(id, storeId);

    if (category.error) {
      this.logger.error(
        `Error retrieving category with ID ${id} for store ${storeId} : ${category.error.message}`,
      );
      throw new BusinessException(category.error.message, 404);
    }
    this.logger.log(
      `Successfully retrieved category with ID ${id} for store ${storeId}.`,
    );
    return {
      id: category.value.id,
      name: category.value.name,
      products: category.value.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        prepTime: product.prepTime,
        imageUrl: product.imageUrl,
      })),
    };
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
    const coreController = new ProductCoreController(this.dataSource);

    const category = await coreController.createProductCategory({
      name,
      storeId,
    });

    if (category.error) {
      this.logger.error(
        `Error creating category for store ${storeId}: ${category.error.message}`,
      );
      throw new BusinessException(category.error.message, 400);
    }
    this.logger.log(
      `Successfully created category for store ${storeId} with ID ${category.value.id}.`,
    );
    return {
      id: category.value.id,
      name: category.value.name,
      products: category.value.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        prepTime: product.prepTime,
        imageUrl: product.imageUrl,
      })),
    };
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
      const coreController = new ProductCoreController(this.dataSource);

      const product = await coreController.createProduct({
        storeId,
        categoryId,
        product: {
          name: createProductDto.name,
          price: createProductDto.price,
          description: createProductDto.description,
          prepTime: createProductDto.prep_time,
          imageUrl: createProductDto.image_url,
        },
      });
      if (product.error) {
        this.logger.error(
          `Error creating product in category ${categoryId} for store ${storeId}: ${product.error.message}`,
        );
        if (product.error.code === ResourceNotFoundException.CODE) {
          throw new BusinessException(product.error.message, 400);
        }
        throw new BusinessException(product.error.message, 400);
      }
      this.logger.log(
        `Successfully created product in category ${categoryId} for store ${req.storeId}.`,
      );
      return {
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        description: product.value.description,
        prepTime: product.value.prepTime,
        imageUrl: product.value.imageUrl,
      };
    } catch (error) {
      this.logger.error(
        `Error creating product in category ${categoryId} for store ${req.storeId}: ${error.message}`,
      );

      if (error instanceof BusinessException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the product. Please try again later.',
      );
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
    try {
      const storeId = req.storeId;
      const coreController = new ProductCoreController(this.dataSource);

      const response = await coreController.deleteProduct(
        productId,
        categoryId,
        storeId,
      );

      if (response.error) {
        this.logger.error(
          `Error deleting product with ID ${productId} : ${response.error.message}`,
        );
        if (response.error.code === ResourceNotFoundException.CODE) {
          throw new BusinessException(response.error.message, 404);
        }

        throw new BusinessException(response.error.message, 400);
      }
      this.logger.log(`Successfully deleted product with ID ${productId}.`);
    } catch (error) {
      this.logger.error(
        `Error deleting product with ID ${productId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'An error occurred while deleting the product. Please try again later.',
      );
    }
  }
}
