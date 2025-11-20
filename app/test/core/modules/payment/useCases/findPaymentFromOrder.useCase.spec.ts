/* eslint-disable @typescript-eslint/unbound-method */
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Order } from 'src/core/modules/order/entities/order.entity';
import { OrderItem } from 'src/core/modules/order/entities/order-item.entity';
import { FindOrderByIdUseCase } from 'src/core/modules/order/useCases/findOrderById.useCase';
import { Payment } from 'src/core/modules/payment/entities/payment.entity';
import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';
import { PaymentGateway } from 'src/core/modules/payment/gateways/payment.gateway';
import { FindPaymentFromOrderUseCase } from 'src/core/modules/payment/useCases/findPaymentFromOrder.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('FindPaymentFromOrderUseCase', () => {
  let useCase: FindPaymentFromOrderUseCase;
  let paymentGateway: PaymentGateway;
  let findOrderByIdUseCase: jest.Mocked<FindOrderByIdUseCase>;
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

    paymentGateway = new PaymentGateway(dataSource);

    findOrderByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindOrderByIdUseCase>;

    useCase = new FindPaymentFromOrderUseCase(
      paymentGateway,
      findOrderByIdUseCase,
    );
  });

  it('should find payment from order successfully', async () => {
    const orderId = 'order-123';
    const storeId = 'store-123';

    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 2,
      unitPrice: 10.99,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: storeId,
      orderItems: [orderItem],
    }).value!;

    const mockPayment = Payment.create({
      orderId: orderId,
      storeId: storeId,
      total: 21.98,
      paymentType: PaymentTypeEnum.PIX,
    }).value!;

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    const findPaymentSpy = jest
      .spyOn(paymentGateway, 'findPaymentByOrderId')
      .mockResolvedValue({
        error: undefined,
        value: mockPayment,
      });

    const result = await useCase.execute(orderId, storeId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Payment);
    expect(result.value!.orderId).toBe(orderId);
    expect(result.value!.storeId).toBe(storeId);
    expect(findOrderByIdUseCase.execute).toHaveBeenCalledWith(orderId);
    expect(findPaymentSpy).toHaveBeenCalledWith(mockOrder.id);
  });

  it('should fail if order not found', async () => {
    const orderId = 'non-existent-order';
    const storeId = 'store-123';

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: new ResourceNotFoundException('Order not found'),
      value: undefined,
    });

    const findPaymentSpy = jest.spyOn(paymentGateway, 'findPaymentByOrderId');

    const result = await useCase.execute(orderId, storeId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Order not found');
    expect(result.value).toBeUndefined();
    expect(findOrderByIdUseCase.execute).toHaveBeenCalledWith(orderId);
    expect(findPaymentSpy).not.toHaveBeenCalled();
  });

  it('should fail if order does not belong to the store', async () => {
    const orderId = 'order-123';
    const storeId = 'store-123';
    const differentStoreId = 'different-store';

    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 1,
      unitPrice: 15.99,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: differentStoreId,
      orderItems: [orderItem],
    }).value!;

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    const findPaymentSpy = jest.spyOn(paymentGateway, 'findPaymentByOrderId');

    const result = await useCase.execute(orderId, storeId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe(
      'Order not found or does not belong to the store',
    );
    expect(result.value).toBeUndefined();
    expect(findOrderByIdUseCase.execute).toHaveBeenCalledWith(orderId);
    expect(findPaymentSpy).not.toHaveBeenCalled();
  });

  it('should fail if payment not found for the order', async () => {
    const orderId = 'order-123';
    const storeId = 'store-123';

    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 1,
      unitPrice: 9.99,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: storeId,
      orderItems: [orderItem],
    }).value!;

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    const findPaymentSpy = jest
      .spyOn(paymentGateway, 'findPaymentByOrderId')
      .mockResolvedValue({
        error: undefined,
        value: null,
      });

    const result = await useCase.execute(orderId, storeId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Payment not found for this order');
    expect(result.value).toBeUndefined();
    expect(findOrderByIdUseCase.execute).toHaveBeenCalledWith(orderId);
    expect(findPaymentSpy).toHaveBeenCalledWith(mockOrder.id);
  });

  it('should handle database errors when finding payment', async () => {
    const orderId = 'order-123';
    const storeId = 'store-123';

    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 3,
      unitPrice: 12.5,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: storeId,
      orderItems: [orderItem],
    }).value!;

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    const findPaymentSpy = jest
      .spyOn(paymentGateway, 'findPaymentByOrderId')
      .mockResolvedValue({
        error: new ResourceNotFoundException('Database connection failed'),
        value: undefined,
      });

    const result = await useCase.execute(orderId, storeId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Database connection failed');
    expect(result.value).toBeUndefined();
    expect(findOrderByIdUseCase.execute).toHaveBeenCalledWith(orderId);
    expect(findPaymentSpy).toHaveBeenCalledWith(mockOrder.id);
  });
});
