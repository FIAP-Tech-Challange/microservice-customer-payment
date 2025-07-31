/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Product } from 'src/core/modules/product/entities/product.entity';
import { FindProductsByIdUseCase } from 'src/core/modules/product/useCases/findProductsById.useCase';
import { CreateOrderDto } from 'src/core/modules/order/DTOs/create-order.dto';
import { Order } from 'src/core/modules/order/entities/order.entity';
import { OrderGateway } from 'src/core/modules/order/gateways/order.gateway';
import { SaveOrderUseCase } from 'src/core/modules/order/useCases/saveOrder.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('SaveOrderUseCase', () => {
  let useCase: SaveOrderUseCase;
  let orderGateway: OrderGateway;
  let findProductsByIdUseCase: jest.Mocked<FindProductsByIdUseCase>;
  let mockGeneralDataSource: jest.Mocked<GeneralDataSource>;

  const createMockProduct = (
    id: string,
    name: string,
    price: number,
    storeId: string,
  ) => {
    return Product.restore({
      id,
      name,
      price,
      description: `Description for ${name}`,
      prepTime: 10,
      imageUrl: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      storeId,
    }).value!;
  };

  beforeEach(() => {
    mockGeneralDataSource = createMockGeneralDataSource();
    const mockNotificationDataSource = createMockNotificationDataSource();
    const fakePaymentDataSource = new FakePaymentDataSource();

    const dataSource = new DataSourceProxy(
      mockGeneralDataSource,
      fakePaymentDataSource,
      mockNotificationDataSource,
    );

    orderGateway = new OrderGateway(dataSource);

    findProductsByIdUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new SaveOrderUseCase(orderGateway, findProductsByIdUseCase);
  });

  it('should save an order successfully', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: 'store-123',
      orderItems: [
        {
          productId: 'product-123',
          quantity: 2,
        },
        {
          productId: 'product-456',
          quantity: 1,
        },
      ],
    };

    const mockProducts = [
      createMockProduct('product-123', 'Product 1', 15.99, 'store-123'),
      createMockProduct('product-456', 'Product 2', 25.5, 'store-123'),
    ];

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const mockOrderSaved = {
      id: 'order-123',
      store_id: 'store-123',
      status: 'P',
      customer_id: null,
      totem_id: null,
      total_price: 57.48, // (15.99 * 2) + (25.50 * 1)
      order_items: [
        {
          id: 'item-123',
          order_id: 'order-123',
          product_id: 'product-123',
          unit_price: 15.99,
          subtotal: 31.98,
          quantity: 2,
          created_at: new Date(),
        },
        {
          id: 'item-456',
          order_id: 'order-123',
          product_id: 'product-456',
          unit_price: 25.5,
          subtotal: 25.5,
          quantity: 1,
          created_at: new Date(),
        },
      ],
      created_at: new Date(),
    };

    mockGeneralDataSource.saveOrder.mockResolvedValue(mockOrderSaved);

    const result = await useCase.execute(createOrderDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Order);
    expect(result.value!.storeId).toBe('store-123');
    expect(result.value!.orderItems).toHaveLength(2);
    expect(findProductsByIdUseCase.execute).toHaveBeenCalledWith(
      ['product-123', 'product-456'],
      'store-123',
    );
    expect(mockGeneralDataSource.saveOrder).toHaveBeenCalledTimes(1);
  });

  it('should save an order with customer ID', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: 'store-123',
      customerId: 'customer-123',
      orderItems: [
        {
          productId: 'product-123',
          quantity: 1,
        },
      ],
    };

    const mockProducts = [
      createMockProduct('product-123', 'Product 1', 15.99, 'store-123'),
    ];

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const mockOrderSaved = {
      id: 'order-123',
      store_id: 'store-123',
      status: 'P',
      customer_id: 'customer-123',
      totem_id: null,
      total_price: 15.99,
      order_items: [
        {
          id: 'item-123',
          order_id: 'order-123',
          product_id: 'product-123',
          unit_price: 15.99,
          subtotal: 15.99,
          quantity: 1,
          created_at: new Date(),
        },
      ],
      created_at: new Date(),
    };

    mockGeneralDataSource.saveOrder.mockResolvedValue(mockOrderSaved);

    const result = await useCase.execute(createOrderDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Order);
    expect(result.value!.customerId).toBe('customer-123');
  });

  it('should save an order with totem ID', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: 'store-123',
      totemId: 'totem-123',
      orderItems: [
        {
          productId: 'product-123',
          quantity: 1,
        },
      ],
    };

    const mockProducts = [
      createMockProduct('product-123', 'Product 1', 15.99, 'store-123'),
    ];

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const mockOrderSaved = {
      id: 'order-123',
      store_id: 'store-123',
      status: 'P',
      customer_id: null,
      totem_id: 'totem-123',
      total_price: 15.99,
      order_items: [
        {
          id: 'item-123',
          order_id: 'order-123',
          product_id: 'product-123',
          unit_price: 15.99,
          subtotal: 15.99,
          quantity: 1,
          created_at: new Date(),
        },
      ],
      created_at: new Date(),
    };

    mockGeneralDataSource.saveOrder.mockResolvedValue(mockOrderSaved);

    const result = await useCase.execute(createOrderDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Order);
    expect(result.value!.totemId).toBe('totem-123');
  });

  it('should fail if products are not found', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: 'store-123',
      orderItems: [
        {
          productId: 'non-existent-product',
          quantity: 1,
        },
      ],
    };

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: new ResourceNotFoundException('Products not found'),
      value: undefined,
    });

    const result = await useCase.execute(createOrderDto);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Products not found');
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.saveOrder).not.toHaveBeenCalled();
  });

  it('should fail if order item creation fails', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: 'store-123',
      orderItems: [
        {
          productId: 'product-123',
          quantity: 0,
        },
      ],
    };

    const mockProducts = [
      createMockProduct('product-123', 'Product 1', 15.99, 'store-123'),
    ];

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const result = await useCase.execute(createOrderDto);

    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error!.message).toBe('Quantity must be greater than zero');
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.saveOrder).not.toHaveBeenCalled();
  });

  it('should fail if order creation fails', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: '',
      orderItems: [
        {
          productId: 'product-123',
          quantity: 1,
        },
      ],
    };

    const mockProducts = [
      createMockProduct('product-123', 'Product 1', 15.99, 'store-123'),
    ];

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    const result = await useCase.execute(createOrderDto);

    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error!.message).toBe('Store ID is required');
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.saveOrder).not.toHaveBeenCalled();
  });

  it('should fail if save order fails', async () => {
    const createOrderDto: CreateOrderDto = {
      storeId: 'store-123',
      orderItems: [
        {
          productId: 'product-123',
          quantity: 1,
        },
      ],
    };

    const mockProducts = [
      createMockProduct('product-123', 'Product 1', 15.99, 'store-123'),
    ];

    findProductsByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockProducts,
    });

    mockGeneralDataSource.saveOrder.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(useCase.execute(createOrderDto)).rejects.toThrow(
      'Database error',
    );
  });
});
