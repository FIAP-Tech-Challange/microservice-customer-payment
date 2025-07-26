import { FindProductsByIdUseCase } from 'src/core/modules/product/useCases/findProductsById.useCase';
import { ProductGateway } from 'src/core/modules/product/gateways/product.gateway';
import { Product } from 'src/core/modules/product/entities/product.entity';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('FindProductsByIdUseCase', () => {
  let mockProductGateway: Partial<ProductGateway>;
  let findProductsByIdUseCase: FindProductsByIdUseCase;

  beforeEach(() => {
    mockProductGateway = {
      findProductsById: jest.fn(),
    };

    findProductsByIdUseCase = new FindProductsByIdUseCase(
      mockProductGateway as ProductGateway,
    );
  });

  it('should find products by ids successfully', async () => {
    const productIds = ['product-123', 'product-456'];
    const storeId = 'store-123';

    const mockProducts = [
      Product.create({
        name: 'Big Burger',
        price: 25.99,
        prepTime: 15,
        storeId: 'store-123',
      }).value!,
      Product.create({
        name: 'Cheese Burger',
        price: 22.99,
        prepTime: 12,
        storeId: 'store-123',
      }).value!,
    ];

    (mockProductGateway.findProductsById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value).toHaveLength(2);
    expect(result.value![0].name).toBe('Big Burger');
    expect(result.value![1].name).toBe('Cheese Burger');
    expect(mockProductGateway.findProductsById).toHaveBeenCalledWith(
      productIds,
    );
  });

  it('should fail when no product IDs provided', async () => {
    const productIds: string[] = [];
    const storeId = 'store-123';

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error?.message).toBe('No product IDs provided');
    expect(result.value).toBeUndefined();
    expect(mockProductGateway.findProductsById).not.toHaveBeenCalled();
  });

  it('should fail when productIds is null', async () => {
    const productIds = null as unknown as string[];
    const storeId = 'store-123';

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error?.message).toBe('No product IDs provided');
    expect(result.value).toBeUndefined();
  });

  it('should fail when productIds is undefined', async () => {
    const productIds = undefined as unknown as string[];
    const storeId = 'store-123';

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error?.message).toBe('No product IDs provided');
    expect(result.value).toBeUndefined();
  });

  it('should handle gateway error', async () => {
    const productIds = ['product-123'];
    const storeId = 'store-123';

    const gatewayError = new Error('Database connection failed');
    (mockProductGateway.findProductsById as jest.Mock).mockResolvedValue({
      error: gatewayError,
      value: undefined,
    });

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBe(gatewayError);
    expect(result.value).toBeUndefined();
  });

  it('should fail when not all products are found', async () => {
    const productIds = ['product-123', 'product-456', 'product-789'];
    const storeId = 'store-123';

    // Gateway returns only 2 products instead of 3
    const mockProducts = [
      Product.create({
        name: 'Big Burger',
        price: 25.99,
        prepTime: 15,
        storeId: 'store-123',
      }).value!,
      Product.create({
        name: 'Cheese Burger',
        price: 22.99,
        prepTime: 12,
        storeId: 'store-123',
      }).value!,
    ];

    (mockProductGateway.findProductsById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toBe('Some products were not found');
    expect(result.value).toBeUndefined();
  });

  it('should find single product', async () => {
    const productIds = ['product-123'];
    const storeId = 'store-123';

    const mockProduct = Product.create({
      name: 'Big Burger',
      price: 25.99,
      prepTime: 15,
      storeId: 'store-123',
    }).value!;

    (mockProductGateway.findProductsById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: [mockProduct],
    });

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value).toHaveLength(1);
    expect(result.value![0]).toBe(mockProduct);
  });

  it('should handle empty product array from gateway', async () => {
    const productIds = ['product-123'];
    const storeId = 'store-123';

    (mockProductGateway.findProductsById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: [],
    });

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toBe('Some products were not found');
    expect(result.value).toBeUndefined();
  });

  it('should handle multiple products with same count as requested', async () => {
    const productIds = ['product-123', 'product-456', 'product-789'];
    const storeId = 'store-123';

    const mockProducts = [
      Product.create({
        name: 'Big Burger',
        price: 25.99,
        prepTime: 15,
        storeId: 'store-123',
      }).value!,
      Product.create({
        name: 'Cheese Burger',
        price: 22.99,
        prepTime: 12,
        storeId: 'store-123',
      }).value!,
      Product.create({
        name: 'Veggie Burger',
        price: 18.99,
        prepTime: 10,
        storeId: 'store-123',
      }).value!,
    ];

    (mockProductGateway.findProductsById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const result = await findProductsByIdUseCase.execute(productIds, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value).toHaveLength(3);
  });
});
