/* eslint-disable @typescript-eslint/unbound-method */
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { OrderGateway } from 'src/core/modules/order/gateways/order.gateway';
import { DeleteOrderUseCase } from 'src/core/modules/order/useCases/deleteOrder.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('DeleteOrderUseCase', () => {
  let useCase: DeleteOrderUseCase;
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
    useCase = new DeleteOrderUseCase(orderGateway);
  });

  it('should delete an order successfully', async () => {
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
      customer_id: 'customer-123',
      totem_id: 'totem-123',
      total_price: 15.99,
      order_items: [mockOrderItemDTO],
      created_at: new Date(),
    };

    mockGeneralDataSource.findOrderById.mockResolvedValue(mockOrderDTO);
    mockGeneralDataSource.deleteOrder.mockResolvedValue(undefined);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
    expect(mockGeneralDataSource.deleteOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        id: orderId,
        store_id: 'store-123',
        status: 'P',
        customer_id: null,
        totem_id: 'totem-123',
      }),
    );
  });

  it('should return error when order is not found', async () => {
    const orderId = 'non-existent-order';

    mockGeneralDataSource.findOrderById.mockResolvedValue(null);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Order not found');
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
    expect(mockGeneralDataSource.deleteOrder).not.toHaveBeenCalled();
  });

  it('should handle database error when finding order', async () => {
    const orderId = 'order-123';
    const dbError = new Error('Database connection failed');

    mockGeneralDataSource.findOrderById.mockRejectedValue(dbError);

    await expect(useCase.execute(orderId)).rejects.toThrow(
      'Database connection failed',
    );
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
    expect(mockGeneralDataSource.deleteOrder).not.toHaveBeenCalled();
  });

  it('should handle database error when deleting order', async () => {
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

    const deleteError = new Error('Delete operation failed');

    mockGeneralDataSource.findOrderById.mockResolvedValue(mockOrderDTO);
    mockGeneralDataSource.deleteOrder.mockRejectedValue(deleteError);

    await expect(useCase.execute(orderId)).rejects.toThrow(
      'Delete operation failed',
    );
    expect(mockGeneralDataSource.findOrderById).toHaveBeenCalledWith(orderId);
    expect(mockGeneralDataSource.deleteOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        id: orderId,
      }),
    );
  });

  it('should delete order without customer', async () => {
    const orderId = 'order-123';

    const mockOrderItemDTO = {
      id: 'item-123',
      order_id: orderId,
      product_id: 'product-123',
      unit_price: 25.5,
      subtotal: 25.5,
      quantity: 1,
      created_at: new Date(),
    };

    const mockOrderDTO = {
      id: orderId,
      store_id: 'store-123',
      status: 'R',
      customer_id: null,
      totem_id: null,
      total_price: 25.5,
      order_items: [mockOrderItemDTO],
      created_at: new Date(),
    };

    mockGeneralDataSource.findOrderById.mockResolvedValue(mockOrderDTO);
    mockGeneralDataSource.deleteOrder.mockResolvedValue(undefined);

    const result = await useCase.execute(orderId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeUndefined();
    expect(mockGeneralDataSource.deleteOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        id: orderId,
        customer_id: null,
        totem_id: null,
        status: 'R',
      }),
    );
  });
});
