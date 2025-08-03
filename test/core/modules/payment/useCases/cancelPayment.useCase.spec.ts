/* eslint-disable @typescript-eslint/unbound-method */
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Payment } from 'src/core/modules/payment/entities/payment.entity';
import { PaymentStatusEnum } from 'src/core/modules/payment/enums/paymentStatus.enum';
import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';
import { PaymentGateway } from 'src/core/modules/payment/gateways/payment.gateway';
import { CancelPaymentUseCase } from 'src/core/modules/payment/useCases/cancelPayment.useCase';
import { FindPaymentByIdUseCase } from 'src/core/modules/payment/useCases/findPaymentById.useCase';
import { SetOrderToCanceledUseCase } from 'src/core/modules/order/useCases/setOrderToCanceled.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('CancelPaymentUseCase', () => {
  let useCase: CancelPaymentUseCase;
  let paymentGateway: PaymentGateway;
  let findPaymentByIdUseCase: jest.Mocked<FindPaymentByIdUseCase>;
  let setOrderToCanceledUseCase: jest.Mocked<SetOrderToCanceledUseCase>;
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

    findPaymentByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindPaymentByIdUseCase>;

    setOrderToCanceledUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SetOrderToCanceledUseCase>;

    useCase = new CancelPaymentUseCase(
      paymentGateway,
      findPaymentByIdUseCase,
      setOrderToCanceledUseCase,
    );
  });

  it('should cancel a payment successfully', async () => {
    const paymentId = 'payment-123';

    const mockPayment = Payment.create({
      orderId: 'order-123',
      storeId: 'store-123',
      total: 25.99,
      paymentType: PaymentTypeEnum.PIX,
    }).value!;

    findPaymentByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockPayment,
    });

    const saveSpy = jest.spyOn(paymentGateway, 'save').mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    setOrderToCanceledUseCase.execute.mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Payment);
    expect(result.value!.status).toBe(PaymentStatusEnum.REFUSED);
    expect(findPaymentByIdUseCase.execute).toHaveBeenCalledWith(paymentId);
    expect(setOrderToCanceledUseCase.execute).toHaveBeenCalledWith(
      'order-123',
      'store-123',
    );
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should fail to cancel if payment not found', async () => {
    const paymentId = 'non-existent-payment';

    findPaymentByIdUseCase.execute.mockResolvedValue({
      error: new ResourceNotFoundException('Payment not found'),
      value: undefined,
    });

    const saveSpy = jest.spyOn(paymentGateway, 'save');

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Payment not found');
    expect(result.value).toBeUndefined();
    expect(setOrderToCanceledUseCase.execute).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should fail to cancel if payment is already approved', async () => {
    const paymentId = 'payment-123';

    const mockPayment = Payment.restore({
      id: paymentId,
      orderId: 'order-123',
      storeId: 'store-123',
      paymentType: PaymentTypeEnum.PIX,
      status: PaymentStatusEnum.APPROVED,
      total: 25.99,
      platform: null,
      externalId: null,
      qrCode: null,
      createdAt: new Date(),
    }).value!;

    findPaymentByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockPayment,
    });

    const saveSpy = jest.spyOn(paymentGateway, 'save');

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe(
      'Payment must be pending to be Rejected',
    );
    expect(result.value).toBeUndefined();
    expect(setOrderToCanceledUseCase.execute).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should fail to cancel if payment is already refused', async () => {
    const paymentId = 'payment-123';

    const mockPayment = Payment.restore({
      id: paymentId,
      orderId: 'order-123',
      storeId: 'store-123',
      paymentType: PaymentTypeEnum.PIX,
      status: PaymentStatusEnum.REFUSED,
      total: 25.99,
      platform: null,
      externalId: null,
      qrCode: null,
      createdAt: new Date(),
    }).value!;

    findPaymentByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockPayment,
    });

    const saveSpy = jest.spyOn(paymentGateway, 'save');

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe(
      'Payment must be pending to be Rejected',
    );
    expect(result.value).toBeUndefined();
    expect(setOrderToCanceledUseCase.execute).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should handle errors from setOrderToCanceled', async () => {
    const paymentId = 'payment-123';

    const mockPayment = Payment.create({
      orderId: 'order-123',
      storeId: 'store-123',
      total: 25.99,
      paymentType: PaymentTypeEnum.QR,
    }).value!;

    findPaymentByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockPayment,
    });

    const saveSpy = jest.spyOn(paymentGateway, 'save').mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    setOrderToCanceledUseCase.execute.mockResolvedValue({
      error: new ResourceNotFoundException('Order cancel failed'),
      value: undefined,
    });

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Order cancel failed');
    expect(result.value).toBeUndefined();
    expect(findPaymentByIdUseCase.execute).toHaveBeenCalledWith(paymentId);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(setOrderToCanceledUseCase.execute).toHaveBeenCalledWith(
      'order-123',
      'store-123',
    );
  });

  it('should handle database errors when saving payment', async () => {
    const paymentId = 'payment-123';

    const mockPayment = Payment.create({
      orderId: 'order-123',
      storeId: 'store-123',
      total: 25.99,
      paymentType: PaymentTypeEnum.CAR,
    }).value!;

    findPaymentByIdUseCase.execute.mockResolvedValue({
      error: undefined,
      value: mockPayment,
    });

    const saveSpy = jest
      .spyOn(paymentGateway, 'save')
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(paymentId)).rejects.toThrow('Database error');

    expect(findPaymentByIdUseCase.execute).toHaveBeenCalledWith(paymentId);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(setOrderToCanceledUseCase.execute).not.toHaveBeenCalled();
  });
});
