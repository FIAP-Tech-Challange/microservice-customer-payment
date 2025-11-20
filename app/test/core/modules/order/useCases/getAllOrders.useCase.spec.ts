import {
  Order,
  OrderStatusEnum,
} from 'src/core/modules/order/entities/order.entity';
import { OrderGateway } from 'src/core/modules/order/gateways/order.gateway';
import { getAllOrdersUseCase } from 'src/core/modules/order/useCases/getAllOrders.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('getAllOrdersUseCase', () => {
  let useCase: getAllOrdersUseCase;
  let orderGateway: OrderGateway;
  let mockGeneralDataSource: jest.Mocked<GeneralDataSource>;

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
    useCase = new getAllOrdersUseCase(orderGateway);
  });

  it('should get all orders successfully', async () => {
    const page = 1;
    const limit = 10;
    const status = 'P';
    const storeId = 'store-123';

    const mockOrderData = [
      {
        id: 'order-1',
        store_id: storeId,
        status: 'P',
        customer_id: 'customer-1',
        totem_id: null,
        total_price: 25.99,
        order_items: [
          {
            id: 'item-1',
            order_id: 'order-1',
            product_id: 'product-1',
            unit_price: 25.99,
            subtotal: 25.99,
            quantity: 1,
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
      },
      {
        id: 'order-2',
        store_id: storeId,
        status: 'P',
        customer_id: null,
        totem_id: 'totem-1',
        total_price: 15.5,
        order_items: [
          {
            id: 'item-2',
            order_id: 'order-2',
            product_id: 'product-2',
            unit_price: 15.5,
            subtotal: 15.5,
            quantity: 1,
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
      },
    ];

    const mockPageData = {
      data: mockOrderData,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    mockGeneralDataSource.getAllOrders.mockResolvedValue(mockPageData);

    const result = await useCase.execute(page, limit, status, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.data).toHaveLength(2);
    expect(result.value!.data[0]).toBeInstanceOf(Order);
    expect(result.value!.data[0].id).toBe('order-1');
    expect(result.value!.data[0].status).toBe(OrderStatusEnum.PENDING);
    expect(result.value!.data[1]).toBeInstanceOf(Order);
    expect(result.value!.data[1].id).toBe('order-2');
    expect(result.value!.total).toBe(2);
    expect(result.value!.page).toBe(1);
    expect(result.value!.limit).toBe(10);
    expect(result.value!.totalPages).toBe(1);
    expect(result.value!.hasNextPage).toBe(false);
    expect(result.value!.hasPreviousPage).toBe(false);
  });

  it('should return empty list when no orders found', async () => {
    const page = 1;
    const limit = 10;
    const status = 'P';
    const storeId = 'store-123';

    const mockPageData = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    mockGeneralDataSource.getAllOrders.mockResolvedValue(mockPageData);

    const result = await useCase.execute(page, limit, status, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.data).toHaveLength(0);
    expect(result.value!.total).toBe(0);
  });

  it('should handle database errors', async () => {
    const page = 1;
    const limit = 10;
    const status = 'P';
    const storeId = 'store-123';
    const dbError = new Error('Database connection failed');

    mockGeneralDataSource.getAllOrders.mockRejectedValue(dbError);

    await expect(useCase.execute(page, limit, status, storeId)).rejects.toThrow(
      'Database connection failed',
    );
  });

  it('should get orders with pagination - second page', async () => {
    const page = 2;
    const limit = 5;
    const status = 'R';
    const storeId = 'store-123';

    const mockOrderData = [
      {
        id: 'order-6',
        store_id: storeId,
        status: 'R',
        customer_id: 'customer-6',
        totem_id: null,
        total_price: 30.0,
        order_items: [
          {
            id: 'item-6',
            order_id: 'order-6',
            product_id: 'product-6',
            unit_price: 30.0,
            subtotal: 30.0,
            quantity: 1,
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
      },
    ];

    const mockPageData = {
      data: mockOrderData,
      total: 11,
      page: 2,
      limit: 5,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    };

    mockGeneralDataSource.getAllOrders.mockResolvedValue(mockPageData);

    const result = await useCase.execute(page, limit, status, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.data).toHaveLength(1);
    expect(result.value!.data[0].status).toBe(OrderStatusEnum.RECEIVED);
    expect(result.value!.total).toBe(11);
    expect(result.value!.page).toBe(2);
    expect(result.value!.limit).toBe(5);
    expect(result.value!.totalPages).toBe(3);
    expect(result.value!.hasNextPage).toBe(true);
    expect(result.value!.hasPreviousPage).toBe(true);
  });

  it('should filter orders by different status', async () => {
    const page = 1;
    const limit = 10;
    const status = 'F';
    const storeId = 'store-123';

    const mockOrderData = [
      {
        id: 'order-finished',
        store_id: storeId,
        status: 'F',
        customer_id: 'customer-finished',
        totem_id: 'totem-finished',
        total_price: 45.75,
        order_items: [
          {
            id: 'item-finished',
            order_id: 'order-finished',
            product_id: 'product-finished',
            unit_price: 45.75,
            subtotal: 45.75,
            quantity: 1,
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
      },
    ];

    const mockPageData = {
      data: mockOrderData,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    mockGeneralDataSource.getAllOrders.mockResolvedValue(mockPageData);

    const result = await useCase.execute(page, limit, status, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.data).toHaveLength(1);
    expect(result.value!.data[0].status).toBe(OrderStatusEnum.FINISHED);
    expect(result.value!.data[0].customerId).toBe('customer-finished');
    expect(result.value!.data[0].totemId).toBe('totem-finished');
  });
});
