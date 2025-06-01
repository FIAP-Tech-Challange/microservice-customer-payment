import { PaymentModel } from '../../../../src/modules/payment/models/domain/payment.model';
import { PaymentPlataformEnum } from '../../../../src/modules/payment/models/enum/payment-plataform.enum';
import { PaymentStatusEnum } from '../../../../src/modules/payment/models/enum/payment-status.enum';
import { PaymentTypeEnum } from '../../../../src/modules/payment/models/enum/payment-type.enum';

describe('PaymentModel (Domain)', () => {
  const validPaymentProps = {
    orderId: 'order-123',
    storeId: 'store-123',
    paymentType: PaymentTypeEnum.PIX,
    total: 99.99,
    externalId: 'ext-123',
    qrCode: 'qr-code-data',
    plataform: PaymentPlataformEnum.MP,
  };

  it('should create a valid payment using create', () => {
    const payment = PaymentModel.create(validPaymentProps);

    expect(payment.id).toBeDefined();
    expect(payment.orderId).toBe(validPaymentProps.orderId);
    expect(payment.storeId).toBe(validPaymentProps.storeId);
    expect(payment.paymentType).toBe(validPaymentProps.paymentType);
    expect(payment.status).toBe(PaymentStatusEnum.PENDING);
    expect(payment.total).toBe(validPaymentProps.total);
    expect(payment.externalId).toBe(validPaymentProps.externalId);
    expect(payment.qrCode).toBe(validPaymentProps.qrCode);
    expect(payment.plataform).toBe(validPaymentProps.plataform);
    expect(payment.createdAt).toBeInstanceOf(Date);
  });

  it('should create a valid payment using fromProps', () => {
    const now = new Date();
    const paymentProps = {
      id: '123',
      orderId: 'order-123',
      storeId: 'store-123',
      paymentType: PaymentTypeEnum.PIX,
      status: PaymentStatusEnum.APPROVED,
      total: 99.99,
      externalId: 'ext-123',
      qrCode: 'qr-code-data',
      plataform: PaymentPlataformEnum.MP,
      createdAt: now,
    };

    const payment = PaymentModel.fromProps(paymentProps);

    expect(payment.id).toBe(paymentProps.id);
    expect(payment.orderId).toBe(paymentProps.orderId);
    expect(payment.storeId).toBe(paymentProps.storeId);
    expect(payment.paymentType).toBe(paymentProps.paymentType);
    expect(payment.status).toBe(paymentProps.status);
    expect(payment.total).toBe(paymentProps.total);
    expect(payment.externalId).toBe(paymentProps.externalId);
    expect(payment.qrCode).toBe(paymentProps.qrCode);
    expect(payment.plataform).toBe(paymentProps.plataform);
    expect(payment.createdAt).toBe(now);
  });

  it('should throw if required fields are missing (create)', () => {
    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        orderId: '',
      }),
    ).toThrow('Order ID is required');

    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        storeId: '',
      }),
    ).toThrow('Store ID is required');

    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        paymentType: '' as PaymentTypeEnum,
      }),
    ).toThrow('Payment Type is required');

    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        total: 0,
      }),
    ).toThrow('Total must be greater than 0');

    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        externalId: '',
      }),
    ).toThrow('Total must be greater than 0');

    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        qrCode: '',
      }),
    ).toThrow('QR Code is required');

    expect(() =>
      PaymentModel.create({
        ...validPaymentProps,
        plataform: '' as PaymentPlataformEnum,
      }),
    ).toThrow('Plataform is required');
  });

  it('should throw if required fields are missing (fromProps)', () => {
    const now = new Date();
    const validProps = {
      id: '123',
      orderId: 'order-123',
      storeId: 'store-123',
      paymentType: PaymentTypeEnum.PIX,
      status: PaymentStatusEnum.APPROVED,
      total: 99.99,
      externalId: 'ext-123',
      qrCode: 'qr-code-data',
      plataform: PaymentPlataformEnum.MP,
      createdAt: now,
    };

    expect(() =>
      PaymentModel.fromProps({
        ...validProps,
        id: '',
      }),
    ).toThrow('ID is required');
  });
});
