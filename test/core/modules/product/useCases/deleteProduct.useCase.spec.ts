import { DeleteProductUseCase } from 'src/core/modules/product/useCases/deleteProduct.useCase';
import { CategoryGateway } from 'src/core/modules/product/gateways/category.gateway';
import { FindCategoryByIdUseCase } from 'src/core/modules/product/useCases/findCategoryById.useCase';
import { Category } from 'src/core/modules/product/entities/category.entity';
import { Product } from 'src/core/modules/product/entities/product.entity';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

describe('DeleteProductUseCase', () => {
  let mockCategoryGateway: Partial<CategoryGateway>;
  let mockFindCategoryByIdUseCase: Partial<FindCategoryByIdUseCase>;
  let deleteProductUseCase: DeleteProductUseCase;

  beforeEach(() => {
    mockCategoryGateway = {
      save: jest.fn(),
    };

    mockFindCategoryByIdUseCase = {
      execute: jest.fn(),
    };

    deleteProductUseCase = new DeleteProductUseCase(
      mockCategoryGateway as CategoryGateway,
      mockFindCategoryByIdUseCase as FindCategoryByIdUseCase,
    );
  });

  it('should delete product successfully', async () => {
    const productId = 'product-123';
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    const mockProduct = Product.create({
      name: 'Big Burger',
      price: 25.99,
      prepTime: 15,
      storeId: 'store-123',
    }).value!;

    Object.defineProperty(mockProduct, '_id', {
      value: productId,
      writable: false,
    });

    mockCategory.addProduct(mockProduct);

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await deleteProductUseCase.execute(
      productId,
      categoryId,
      storeId,
    );

    expect(result.error).toBeUndefined();
    expect(result.value).toBeUndefined();
    expect(mockCategory.products).toHaveLength(0);
    expect(mockFindCategoryByIdUseCase.execute).toHaveBeenCalledWith(
      categoryId,
      storeId,
    );
    expect(mockCategoryGateway.save).toHaveBeenCalledWith(mockCategory);
  });

  it('should fail when category does not exist', async () => {
    const productId = 'product-123';
    const categoryId = 'non-existent-category';
    const storeId = 'store-123';

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: new ResourceNotFoundException('Category not found'),
      value: undefined,
    });

    const result = await deleteProductUseCase.execute(
      productId,
      categoryId,
      storeId,
    );

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should fail when product does not exist in category', async () => {
    const productId = 'non-existent-product';
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const result = await deleteProductUseCase.execute(
      productId,
      categoryId,
      storeId,
    );

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should handle save error', async () => {
    const productId = 'product-123';
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    const mockProduct = Product.create({
      name: 'Big Burger',
      price: 25.99,
      prepTime: 15,
      storeId: 'store-123',
    }).value!;

    Object.defineProperty(mockProduct, '_id', {
      value: productId,
      writable: false,
    });

    mockCategory.addProduct(mockProduct);

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const saveError = new Error('Failed to save category');
    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: saveError,
      value: undefined,
    });

    const result = await deleteProductUseCase.execute(
      productId,
      categoryId,
      storeId,
    );

    expect(result.error).toBe(saveError);
    expect(result.value).toBeUndefined();
  });

  it('should delete one product and leave others intact', async () => {
    const productId1 = 'product-123';
    const productId2 = 'product-456';
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    const mockProduct1 = Product.create({
      name: 'Big Burger',
      price: 25.99,
      prepTime: 15,
      storeId: 'store-123',
    }).value!;

    const mockProduct2 = Product.create({
      name: 'Cheese Burger',
      price: 22.99,
      prepTime: 12,
      storeId: 'store-123',
    }).value!;

    Object.defineProperty(mockProduct1, '_id', {
      value: productId1,
      writable: false,
    });
    Object.defineProperty(mockProduct2, '_id', {
      value: productId2,
      writable: false,
    });

    mockCategory.addProduct(mockProduct1);
    mockCategory.addProduct(mockProduct2);

    (mockFindCategoryByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await deleteProductUseCase.execute(
      productId1,
      categoryId,
      storeId,
    );

    expect(result.error).toBeUndefined();
    expect(result.value).toBeUndefined();
    expect(mockCategory.products).toHaveLength(1);
    expect(mockCategory.products[0].id).toBe(productId2);
  });
});
