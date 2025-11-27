import { CreateCategoryUseCase } from 'src/core/modules/product/useCases/createCategory.useCase';
import { CategoryGateway } from 'src/core/modules/product/gateways/category.gateway';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { Category } from 'src/core/modules/product/entities/category.entity';
import { CreateCategoryInputDTO } from 'src/core/modules/product/DTOs/createCategoryInput.dto';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('CreateCategoryUseCase', () => {
  let mockCategoryGateway: Partial<CategoryGateway>;
  let mockFindStoreByIdUseCase: Partial<FindStoreByIdUseCase>;
  let createCategoryUseCase: CreateCategoryUseCase;

  beforeEach(() => {
    mockCategoryGateway = {
      findCategoryByName: jest.fn(),
      save: jest.fn(),
    };

    mockFindStoreByIdUseCase = {
      execute: jest.fn(),
    };

    createCategoryUseCase = new CreateCategoryUseCase(
      mockCategoryGateway as CategoryGateway,
      mockFindStoreByIdUseCase as FindStoreByIdUseCase,
    );
  });

  it('should create a category successfully', async () => {
    const inputDto: CreateCategoryInputDTO = {
      name: 'Hamburgers',
      storeId: 'store-123',
    };

    const mockStore = { id: 'store-123', name: 'Test Store' };

    (mockFindStoreByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    (mockCategoryGateway.findCategoryByName as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await createCategoryUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.name).toBe('Hamburgers');
    expect(result.value!.storeId).toBe('store-123');
    expect(mockFindStoreByIdUseCase.execute).toHaveBeenCalledWith('store-123');
    expect(mockCategoryGateway.findCategoryByName).toHaveBeenCalledWith(
      'Hamburgers',
      'store-123',
    );
    expect(mockCategoryGateway.save).toHaveBeenCalledWith(result.value);
  });

  it('should fail when store does not exist', async () => {
    const inputDto: CreateCategoryInputDTO = {
      name: 'Hamburgers',
      storeId: 'non-existent-store',
    };

    (mockFindStoreByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: new ResourceNotFoundException('Store not found'),
      value: undefined,
    });

    const result = await createCategoryUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.findCategoryByName).not.toHaveBeenCalled();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should fail when category with same name already exists', async () => {
    const inputDto: CreateCategoryInputDTO = {
      name: 'Hamburgers',
      storeId: 'store-123',
    };

    const mockStore = { id: 'store-123', name: 'Test Store' };

    (mockFindStoreByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    const existingCategory = Category.create({
      name: 'Hamburgers',
      storeId: 'store-123',
    }).value!;

    (mockCategoryGateway.findCategoryByName as jest.Mock).mockResolvedValue({
      error: undefined,
      value: existingCategory,
    });

    const result = await createCategoryUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should handle gateway error when checking for existing category', async () => {
    const inputDto: CreateCategoryInputDTO = {
      name: 'Hamburgers',
      storeId: 'store-123',
    };

    const mockStore = { id: 'store-123', name: 'Test Store' };

    (mockFindStoreByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    const gatewayError = new Error('Database connection failed');
    (mockCategoryGateway.findCategoryByName as jest.Mock).mockResolvedValue({
      error: gatewayError,
      value: undefined,
    });

    const result = await createCategoryUseCase.execute(inputDto);

    expect(result.error).toBe(gatewayError);
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });

  it('should handle save error', async () => {
    const inputDto: CreateCategoryInputDTO = {
      name: 'Hamburgers',
      storeId: 'store-123',
    };

    const mockStore = { id: 'store-123', name: 'Test Store' };

    (mockFindStoreByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    (mockCategoryGateway.findCategoryByName as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const saveError = new Error('Failed to save category');
    (mockCategoryGateway.save as jest.Mock).mockResolvedValue({
      error: saveError,
      value: undefined,
    });

    const result = await createCategoryUseCase.execute(inputDto);

    expect(result.error).toBe(saveError);
    expect(result.value).toBeUndefined();
  });

  it('should fail with invalid category data', async () => {
    const inputDto: CreateCategoryInputDTO = {
      name: 'AB',
      storeId: 'store-123',
    };

    const mockStore = { id: 'store-123', name: 'Test Store' };

    (mockFindStoreByIdUseCase.execute as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    (mockCategoryGateway.findCategoryByName as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await createCategoryUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockCategoryGateway.save).not.toHaveBeenCalled();
  });
});
