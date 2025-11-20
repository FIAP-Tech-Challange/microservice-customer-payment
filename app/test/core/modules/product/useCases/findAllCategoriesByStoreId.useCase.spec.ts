import { FindAllCategoriesByStoreIdUseCase } from 'src/core/modules/product/useCases/findAllCategoriesByStoreId.useCase';
import { CategoryGateway } from 'src/core/modules/product/gateways/category.gateway';
import { Category } from 'src/core/modules/product/entities/category.entity';

describe('FindAllCategoriesByStoreIdUseCase', () => {
  let mockCategoryGateway: Partial<CategoryGateway>;
  let findAllCategoriesByStoreIdUseCase: FindAllCategoriesByStoreIdUseCase;

  beforeEach(() => {
    mockCategoryGateway = {
      findAllCategoriesByStoreId: jest.fn(),
    };

    findAllCategoriesByStoreIdUseCase = new FindAllCategoriesByStoreIdUseCase(
      mockCategoryGateway as CategoryGateway,
    );
  });

  it('should find all categories by store id successfully', async () => {
    const storeId = 'store-123';

    const mockCategories = [
      Category.create({
        name: 'Hamburgers',
        storeId: 'store-123',
      }).value!,
      Category.create({
        name: 'Pizzas',
        storeId: 'store-123',
      }).value!,
      Category.create({
        name: 'Drinks',
        storeId: 'store-123',
      }).value!,
    ];

    (
      mockCategoryGateway.findAllCategoriesByStoreId as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: mockCategories,
    });

    const result = await findAllCategoriesByStoreIdUseCase.execute(storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value).toHaveLength(3);
    expect(result.value![0].name).toBe('Hamburgers');
    expect(result.value![1].name).toBe('Pizzas');
    expect(result.value![2].name).toBe('Drinks');
    expect(mockCategoryGateway.findAllCategoriesByStoreId).toHaveBeenCalledWith(
      storeId,
    );
  });

  it('should return empty array when no categories found', async () => {
    const storeId = 'store-without-categories';

    (
      mockCategoryGateway.findAllCategoriesByStoreId as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: [],
    });

    const result = await findAllCategoriesByStoreIdUseCase.execute(storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value).toHaveLength(0);
  });

  it('should handle gateway error', async () => {
    const storeId = 'store-123';

    const gatewayError = new Error('Database connection failed');
    (
      mockCategoryGateway.findAllCategoriesByStoreId as jest.Mock
    ).mockResolvedValue({
      error: gatewayError,
      value: undefined,
    });

    const result = await findAllCategoriesByStoreIdUseCase.execute(storeId);

    expect(result.error).toBe(gatewayError);
    expect(result.value).toBeUndefined();
  });

  it('should find single category', async () => {
    const storeId = 'store-123';

    const mockCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (
      mockCategoryGateway.findAllCategoriesByStoreId as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: [mockCategory],
    });

    const result = await findAllCategoriesByStoreIdUseCase.execute(storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value).toHaveLength(1);
    expect(result.value![0]).toBe(mockCategory);
  });

  it('should handle null/undefined response from gateway', async () => {
    const storeId = 'store-123';

    (
      mockCategoryGateway.findAllCategoriesByStoreId as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: null,
    });

    const result = await findAllCategoriesByStoreIdUseCase.execute(storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeNull();
  });
});
