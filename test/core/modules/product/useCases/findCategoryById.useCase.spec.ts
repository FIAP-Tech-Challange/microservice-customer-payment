import { FindCategoryByIdUseCase } from 'src/core/modules/product/useCases/findCategoryById.useCase';
import { CategoryGateway } from 'src/core/modules/product/gateways/category.gateway';
import { Category } from 'src/core/modules/product/entities/category.entity';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('FindCategoryByIdUseCase', () => {
  let mockCategoryGateway: Partial<CategoryGateway>;
  let findCategoryByIdUseCase: FindCategoryByIdUseCase;

  beforeEach(() => {
    mockCategoryGateway = {
      findCategoryById: jest.fn(),
    };

    findCategoryByIdUseCase = new FindCategoryByIdUseCase(
      mockCategoryGateway as CategoryGateway,
    );
  });

  it('should find category by id successfully', async () => {
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockCategoryGateway.findCategoryById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const result = await findCategoryByIdUseCase.execute(categoryId, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBe(mockCategory);
    expect(mockCategoryGateway.findCategoryById).toHaveBeenCalledWith(
      categoryId,
    );
  });

  it('should fail when category is not found', async () => {
    const categoryId = 'non-existent-category';
    const storeId = 'store-123';

    (mockCategoryGateway.findCategoryById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: null,
    });

    const result = await findCategoryByIdUseCase.execute(categoryId, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toBe('Category not found');
    expect(result.value).toBeUndefined();
  });

  it('should fail when category belongs to different store', async () => {
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'different-store-456',
    }).value!;

    (mockCategoryGateway.findCategoryById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCategory,
    });

    const result = await findCategoryByIdUseCase.execute(categoryId, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toBe('Category not found');
    expect(result.value).toBeUndefined();
  });

  it('should handle gateway error', async () => {
    const categoryId = 'category-123';
    const storeId = 'store-123';

    const gatewayError = new Error('Database connection failed');
    (mockCategoryGateway.findCategoryById as jest.Mock).mockResolvedValue({
      error: gatewayError,
      value: undefined,
    });

    const result = await findCategoryByIdUseCase.execute(categoryId, storeId);

    expect(result.error).toBe(gatewayError);
    expect(result.value).toBeUndefined();
  });

  it('should handle gateway returning undefined value without error', async () => {
    const categoryId = 'category-123';
    const storeId = 'store-123';

    (mockCategoryGateway.findCategoryById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await findCategoryByIdUseCase.execute(categoryId, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toBe('Category not found');
    expect(result.value).toBeUndefined();
  });
});
