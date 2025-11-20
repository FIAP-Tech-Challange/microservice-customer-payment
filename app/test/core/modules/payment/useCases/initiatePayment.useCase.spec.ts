/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Payment } from 'src/core/modules/payment/entities/payment.entity';
import { PaymentStatusEnum } from 'src/core/modules/payment/enums/paymentStatus.enum';
import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';
import { InitiatePaymentUseCase } from 'src/core/modules/payment/useCases/initiatePayment.useCase';
import { PaymentGateway } from 'src/core/modules/payment/gateways/payment.gateway';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { FindOrderByIdUseCase } from 'src/core/modules/order/useCases/findOrderById.useCase';
import { Order } from 'src/core/modules/order/entities/order.entity';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { OrderItem } from 'src/core/modules/order/entities/order-item.entity';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

function createMockStore(): Store {
  const phone = BrazilianPhone.create('11999999999').value!;
  const email = Email.create('test@test.com').value!;
  const cnpj = CNPJ.create('11.222.333/0001-81').value!;

  return Store.restore({
    id: 'store-123',
    name: 'Test Store',
    fantasyName: 'Test Fantasy',
    phone: phone,
    email: email,
    cnpj: cnpj,
    passwordHash: 'hashed-password',
    salt: 'salt-value',
    createdAt: new Date(),
    totems: [],
  }).value!;
}

describe('InitiatePaymentUseCase', () => {
  let useCase: InitiatePaymentUseCase;
  let paymentGateway: PaymentGateway;
  let mockGeneralDataSource: jest.Mocked<GeneralDataSource>;
  let findStoreByIdUseCase: jest.Mocked<FindStoreByIdUseCase>;
  let findOrderByIdUseCase: jest.Mocked<FindOrderByIdUseCase>;

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

    findStoreByIdUseCase = {
      execute: jest.fn(),
    } as any;

    findOrderByIdUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new InitiatePaymentUseCase(
      paymentGateway,
      findOrderByIdUseCase,
      findStoreByIdUseCase,
    );
  });

  it('should initiate payment successfully', async () => {
    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 2,
      unitPrice: 15.99,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: 'store-123',
      orderItems: [orderItem],
    }).value!;

    const mockStore = createMockStore();

    findStoreByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    const result = await useCase.execute({
      orderId: mockOrder.id,
      storeId: mockStore.id,
      paymentType: PaymentTypeEnum.PIX,
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value!.orderId).toBe(mockOrder.id);
    expect(result.value!.storeId).toBe(mockStore.id);
    expect(result.value!.paymentType).toBe(PaymentTypeEnum.PIX);
    expect(result.value!.status).toBe(PaymentStatusEnum.PENDING);
    expect(result.value!.total).toBe(mockOrder.totalPrice);
  });

  it('should return error when store not found', async () => {
    findStoreByIdUseCase.execute.mockResolvedValue({
      error: new ResourceNotFoundException('Store not found'),
      value: undefined,
    });

    const result = await useCase.execute({
      orderId: 'order-123',
      storeId: 'store-123',
      paymentType: PaymentTypeEnum.PIX,
    });

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(findStoreByIdUseCase.execute).toHaveBeenCalledWith('store-123');
    expect(findOrderByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return error when order not found', async () => {
    const mockStore = createMockStore();

    findStoreByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: new ResourceNotFoundException('Order not found'),
      value: undefined,
    });

    const result = await useCase.execute({
      orderId: 'order-123',
      storeId: mockStore.id,
      paymentType: PaymentTypeEnum.PIX,
    });

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(findStoreByIdUseCase.execute).toHaveBeenCalledWith(mockStore.id);
    expect(findOrderByIdUseCase.execute).toHaveBeenCalledWith('order-123');
  });

  it('should return error when payment creation fails', async () => {
    const mockStore = createMockStore();

    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 1,
      unitPrice: 10.0,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: mockStore.id,
      orderItems: [orderItem],
    }).value!;

    findStoreByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    jest.spyOn(Payment, 'create').mockReturnValue({
      error: new ResourceNotFoundException('Payment creation failed'),
      value: undefined,
    });

    const result = await useCase.execute({
      orderId: mockOrder.id,
      storeId: mockStore.id,
      paymentType: PaymentTypeEnum.PIX,
    });

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
  });

  it('should return error when payment save fails', async () => {
    const orderItem = OrderItem.create({
      productId: 'product-123',
      quantity: 2,
      unitPrice: 15.99,
    }).value!;

    const mockOrder = Order.create({
      customerId: 'customer-123',
      storeId: 'store-123',
      orderItems: [orderItem],
    }).value!;

    const mockStore = createMockStore();

    findStoreByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockStore,
    });

    findOrderByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockOrder,
    });

    jest.spyOn(paymentGateway, 'save').mockResolvedValue({
      error: new ResourceNotFoundException('Database error'),
      value: undefined,
    });

    const result = await useCase.execute({
      orderId: mockOrder.id,
      storeId: mockStore.id,
      paymentType: PaymentTypeEnum.PIX,
    });

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
  });
});
