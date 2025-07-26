import { CreateProductUseCase } from 'src/core/modules/product/useCases/createProduct.useCase';
import { CategoryGateway } from 'src/core/modules/product/gateways/category.gateway';
import { FindCategoryByIdUseCase } from 'src/core/modules/product/useCases/findCategoryById.useCase';
import { Category } from 'src/core/modules/product/entities/category.entity';
import { Product } from 'src/core/modules/product/entities/product.entity';
import { CreateProductInputDTO } from 'src/core/modules/product/DTOs/createProductInput.dto';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

describe('CreateProductUseCase', () => {
  let mockCategoryGateway: Partial<CategoryGateway>;
  let mockFindCategoryByIdUseCase: Partial<FindCategoryByIdUseCase>;
  let createProductUseCase: CreateProductUseCase;

  beforeEach(() => {
    mockCategoryGateway = {
      save: jest.fn(),
    };

    mockFindCategoryByIdUseCase = {
      execute: jest.fn(),
    };

    createProductUseCase = new CreateProductUseCase(
      mockCategoryGateway as CategoryGateway,
      mockFindCategoryByIdUseCase as FindCategoryByIdUseCase,
    );
  });

  it('should create a product successfully', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'Big Burger',
        price: 25.99,
        description: 'Delicious burger with cheese',
        prepTime: 15,
        imageUrl: 'https://example.com/burger.jpg',
      },
      categoryId: 'category-123',
      storeId: 'store-123',
    };

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.name).toBe('Big Burger');
    expect(result.value!.price).toBe(25.99);
    expect(result.value!.description).toBe('Delicious burger with cheese');
    expect(result.value!.prepTime).toBe(15);
    expect(result.value!.imageUrl).toBe('https://example.com/burger.jpg');
    expect(result.value!.storeId).toBe('store-123');

    expect(mockFindCategoryByIdUseCase.execute).toHaveBeenCalledWith(
      'category-123',
      'store-123',
    );
    expect(mockCategoryGateway.save).toHaveBeenCalledWith(mockCategory);
  });

  it('should create a product with minimal data', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'Simple Burger',
        price: 20.5,
        prepTime: 10,
      },
      categoryId: 'category-123',
      storeId: 'store-123',
    };

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.name).toBe('Simple Burger');
    expect(result.value!.price).toBe(20.5);
    expect(result.value!.description).toBe('');
    expect(result.value!.prepTime).toBe(10);
    expect(result.value!.imageUrl).toBeUndefined();
  });

  it('should fail when category does not exist', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'Big Burger',
        price: 25.99,
        prepTime: 15,
      },
      categoryId: 'non-existent-category',
      storeId: 'store-123',
    };

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: new ResourceNotFoundException('Category not found'),
      value: undefined,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should fail when product data is invalid', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'AB',
        price: 25.99,
        prepTime: 15,
      },
      categoryId: 'category-123',
      storeId: 'store-123',
    };

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should fail when adding product to category fails', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'Duplicate Product',
        price: 25.99,
        prepTime: 15,
      },
      categoryId: 'category-123',
      storeId: 'store-123',
    };

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    const existingProduct = Product.create({
      name: 'Duplicate Product',
      price: 20.99,
      prepTime: 12,
      storeId: 'store-123',
    }).value!;
    mockCategory.addProduct(existingProduct);

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should handle save error', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'Big Burger',
        price: 25.99,
        prepTime: 15,
      },
      categoryId: 'category-123',
      storeId: 'store-123',
    };

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const saveError = new Error('Failed to save category');
    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: saveError,
      value: undefined,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBe(saveError);
    expect(result.value).toBeUndefined();
  });

  it('should fail with invalid price', async () => {
    const inputDto: CreateProductInputDTO = {
      product: {
        name: 'Invalid Product',
        price: -10,
        prepTime: 15,
      },
      categoryId: 'category-123',
      storeId: 'store-123',
    };

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const result = await createProductUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });
});
