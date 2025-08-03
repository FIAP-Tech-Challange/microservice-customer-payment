import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Payment } from 'src/core/modules/payment/entities/payment.entity';
import { PaymentPlatformEnum } from 'src/core/modules/payment/enums/paymentPlatform.enum';
import { PaymentStatusEnum } from 'src/core/modules/payment/enums/paymentStatus.enum';
import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';
import { PaymentGateway } from 'src/core/modules/payment/gateways/payment.gateway';
import { FindPaymentByIdUseCase } from 'src/core/modules/payment/useCases/findPaymentById.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('FindPaymentByIdUseCase', () => {
  let useCase: FindPaymentByIdUseCase;
  let paymentGateway: PaymentGateway;
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
    useCase = new FindPaymentByIdUseCase(paymentGateway);
  });

  it('should find a payment by ID successfully', async () => {
    const paymentId = 'payment-123';

    const mockPaymentDTO = {
      id: paymentId,
      order_id: 'order-123',
      store_id: 'store-123',
      payment_type: PaymentTypeEnum.PIX,
      status: PaymentStatusEnum.APPROVED,
      total: 25.99,
      platform: PaymentPlatformEnum.MP,
      external_id: 'ext-123',
      qr_code: null,
      created_at: new Date().toISOString(),
    };

    mockGeneralDataSource.findPaymentById.mockResolvedValue(mockPaymentDTO);

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Payment);
    expect(result.value!.id).toBe(paymentId);
    expect(result.value!.orderId).toBe('order-123');
    expect(result.value!.storeId).toBe('store-123');
    expect(result.value!.paymentType).toBe(PaymentTypeEnum.PIX);
    expect(result.value!.status).toBe(PaymentStatusEnum.APPROVED);
    expect(result.value!.total).toBe(25.99);
    expect(result.value!.platform).toBe(PaymentPlatformEnum.MP);
    expect(result.value!.externalId).toBe('ext-123');
    expect(result.value!.qrCode).toBeNull();
  });

  it('should find a payment with QR code', async () => {
    const paymentId = 'payment-456';

    const mockPaymentDTO = {
      id: paymentId,
      order_id: 'order-456',
      store_id: 'store-456',
      payment_type: PaymentTypeEnum.QR,
      status: PaymentStatusEnum.PENDING,
      total: 15.5,
      platform: PaymentPlatformEnum.FK,
      external_id: 'ext-456',
      qr_code: 'qr-code-data',
      created_at: new Date().toISOString(),
    };

    mockGeneralDataSource.findPaymentById.mockResolvedValue(mockPaymentDTO);

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Payment);
    expect(result.value!.paymentType).toBe(PaymentTypeEnum.QR);
    expect(result.value!.qrCode).toBe('qr-code-data');
    expect(result.value!.status).toBe(PaymentStatusEnum.PENDING);
  });

  it('should return error when payment is not found', async () => {
    const paymentId = 'non-existent-payment';

    mockGeneralDataSource.findPaymentById.mockResolvedValue(null);

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Payment not found');
    expect(result.value).toBeUndefined();
  });

  it('should handle database errors', async () => {
    const paymentId = 'payment-123';
    const dbError = new Error('Database connection failed');

    mockGeneralDataSource.findPaymentById.mockRejectedValue(dbError);

    await expect(useCase.execute(paymentId)).rejects.toThrow(
      'Database connection failed',
    );
  });

  it('should find a payment without external association', async () => {
    const paymentId = 'payment-789';

    const mockPaymentDTO = {
      id: paymentId,
      order_id: 'order-789',
      store_id: 'store-789',
      payment_type: PaymentTypeEnum.CAR,
      status: PaymentStatusEnum.PENDING,
      total: 99.99,
      platform: '',
      external_id: '',
      qr_code: null,
      created_at: new Date().toISOString(),
    };

    mockGeneralDataSource.findPaymentById.mockResolvedValue(mockPaymentDTO);

    const result = await useCase.execute(paymentId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Payment);
    expect(result.value!.platform).toBe('');
    expect(result.value!.externalId).toBe('');
    expect(result.value!.qrCode).toBeNull();
    expect(result.value!.paymentType).toBe(PaymentTypeEnum.CAR);
  });
});
