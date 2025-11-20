/* eslint-disable @typescript-eslint/unbound-method */
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import {
  Order,
  OrderStatusEnum,
} from 'src/core/modules/order/entities/order.entity';
import { OrderGateway } from 'src/core/modules/order/gateways/order.gateway';
import { FindOrderByIdUseCase } from 'src/core/modules/order/useCases/findOrderById.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('FindOrderByIdUseCase', () => {
  let useCase: FindOrderByIdUseCase;
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
    useCase = new FindOrderByIdUseCase(orderGateway);
  });

  it('should find an order by ID successfully', async () => {
    const orderId = 'order-123';

    const mockOrderItemDTO = {
      id: 'item-123',
      order_id: orderId,
      product_id: 'product-123',
      unit_price: 15.99,
      subtotal: 31.98,
      quantity: 2,
      created_at: new Date(),
    };

    const mockOrderDTO = {
      id: orderId,
      store_id: 'store-123',
      status: 'P',
      customer_id: 'customer-123',
      totem_id: 'totem-123',
      total_price: 31.98,
      order_items: [mockOrderItemDTO],
      created_at: new Date(),
    };

    mockGeneralDataSource.findOrderById.mockResolvedValue(mockOrderDTO);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Order);
    expect(result.value!.id).toBe(orderId);
    expect(result.value!.storeId).toBe('store-123');
    expect(result.value!.status).toBe(OrderStatusEnum.PENDING);
    expect(result.value!.customerId).toBe('customer-123');
    expect(result.value!.totemId).toBe('totem-123');
    expect(result.value!.orderItems).toHaveLength(1);
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
  });

  it('should return null when order is not found', async () => {
    const orderId = 'non-existent-order';

    mockGeneralDataSource.findOrderById.mockResolvedValue(null);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Order not found');
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
  });

  it('should handle database errors', async () => {
    const orderId = 'order-123';
    const dbError = new Error('Database connection failed');

    mockGeneralDataSource.findOrderById.mockRejectedValue(dbError);

    await expect(useCase.execute(orderId)).rejects.toThrow(
      'Database connection failed',
    );
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
  });

  it('should find an order without customer ID', async () => {
    const orderId = 'order-123';

    const mockOrderItemDTO = {
      id: 'item-123',
      order_id: orderId,
      product_id: 'product-123',
      unit_price: 15.99,
      subtotal: 15.99,
      quantity: 1,
      created_at: new Date(),
    };

    const mockOrderDTO = {
      id: orderId,
      store_id: 'store-123',
      status: 'P',
      customer_id: null,
      totem_id: null,
      total_price: 15.99,
      order_items: [mockOrderItemDTO],
      created_at: new Date(),
    };

    mockGeneralDataSource.findOrderById.mockResolvedValue(mockOrderDTO);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Order);
    expect(result.value!.customerId).toBeUndefined();
    expect(result.value!.totemId).toBeUndefined();
  });

  it('should find an order with multiple items', async () => {
    const orderId = 'order-123';

    const mockOrderItemDTOs = [
      {
        id: 'item-123',
        order_id: orderId,
        product_id: 'product-123',
        unit_price: 15.99,
        subtotal: 31.98,
        quantity: 2,
        created_at: new Date(),
      },
      {
        id: 'item-456',
        order_id: orderId,
        product_id: 'product-456',
        unit_price: 10.5,
        subtotal: 10.5,
        quantity: 1,
        created_at: new Date(),
      },
    ];

    const mockOrderDTO = {
      id: orderId,
      store_id: 'store-123',
      status: 'R',
      customer_id: 'customer-123',
      totem_id: null,
      total_price: 42.48,
      order_items: mockOrderItemDTOs,
      created_at: new Date(),
    };

    mockGeneralDataSource.findOrderById.mockResolvedValue(mockOrderDTO);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Order);
    expect(result.value!.orderItems).toHaveLength(2);
    expect(result.value!.status).toBe(OrderStatusEnum.RECEIVED);
    expect(result.value!.totalPrice).toBeCloseTo(42.48, 2);
  });
});
