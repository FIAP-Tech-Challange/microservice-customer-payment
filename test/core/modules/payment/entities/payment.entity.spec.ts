import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { Payment } from 'src/core/modules/payment/entities/payment.entity';
import { PaymentPlatformEnum } from 'src/core/modules/payment/enums/paymentPlatform.enum';
import { PaymentStatusEnum } from 'src/core/modules/payment/enums/paymentStatus.enum';
import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';

describe('Payment Entity', () => {
  describe('create', () => {
    it('should create a payment successfully', () => {
      const result = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Payment);
      expect(result.value!.orderId).toBe('order-123');
      expect(result.value!.storeId).toBe('store-123');
      expect(result.value!.total).toBe(25.99);
      expect(result.value!.paymentType).toBe(PaymentTypeEnum.PIX);
      expect(result.value!.status).toBe(PaymentStatusEnum.PENDING);
      expect(result.value!.externalId).toBeNull();
      expect(result.value!.qrCode).toBeNull();
      expect(result.value!.platform).toBeNull();
      expect(result.value!.id).toBeDefined();
      expect(result.value!.createdAt).toBeInstanceOf(Date);
    });

    it('should create a payment with QR type', () => {
      const result = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 15.5,
        paymentType: PaymentTypeEnum.QR,
      });

      expect(result.error).toBeUndefined();
      expect(result.value!.paymentType).toBe(PaymentTypeEnum.QR);
    });

    it('should create a payment with different payment types', () => {
      const paymentTypes = [
        PaymentTypeEnum.PIX,
        PaymentTypeEnum.QR,
        PaymentTypeEnum.MON,
        PaymentTypeEnum.CAR,
      ];

      paymentTypes.forEach((type) => {
        const result = Payment.create({
          orderId: 'order-123',
          storeId: 'store-123',
          total: 10.0,
          paymentType: type,
        });

        expect(result.error).toBeUndefined();
        expect(result.value!.paymentType).toBe(type);
      });
    });

    it('should fail to create payment with zero total', () => {
      const result = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 0,
        paymentType: PaymentTypeEnum.PIX,
      });

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Total must be greater than 0');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create payment with negative total', () => {
      const result = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: -10.5,
        paymentType: PaymentTypeEnum.PIX,
      });

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Total must be greater than 0');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create payment without orderId', () => {
      const result = Payment.create({
        orderId: '',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      });

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Order ID is required');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create payment without storeId', () => {
      const result = Payment.create({
        orderId: 'order-123',
        storeId: '',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      });

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Store ID is required');
      expect(result.value).toBeUndefined();
    });
  });

  describe('restore', () => {
    it('should restore a payment successfully', () => {
      const paymentProps = {
        id: 'payment-123',
        orderId: 'order-123',
        storeId: 'store-123',
        paymentType: PaymentTypeEnum.PIX,
        status: PaymentStatusEnum.APPROVED,
        total: 25.99,
        platform: PaymentPlatformEnum.MP,
        externalId: 'ext-123',
        qrCode: null,
        createdAt: new Date(),
      };

      const result = Payment.restore(paymentProps);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Payment);
      expect(result.value!.id).toBe('payment-123');
      expect(result.value!.status).toBe(PaymentStatusEnum.APPROVED);
      expect(result.value!.platform).toBe(PaymentPlatformEnum.MP);
      expect(result.value!.externalId).toBe('ext-123');
    });

    it('should restore a payment with QR code', () => {
      const paymentProps = {
        id: 'payment-123',
        orderId: 'order-123',
        storeId: 'store-123',
        paymentType: PaymentTypeEnum.QR,
        status: PaymentStatusEnum.PENDING,
        total: 15.5,
        platform: PaymentPlatformEnum.FK,
        externalId: 'ext-456',
        qrCode: 'qr-code-data',
        createdAt: new Date(),
      };

      const result = Payment.restore(paymentProps);

      expect(result.error).toBeUndefined();
      expect(result.value!.qrCode).toBe('qr-code-data');
    });

    it('should fail to restore payment with invalid data', () => {
      const paymentProps = {
        id: '',
        orderId: 'order-123',
        storeId: 'store-123',
        paymentType: PaymentTypeEnum.PIX,
        status: PaymentStatusEnum.PENDING,
        total: 25.99,
        platform: null,
        externalId: null,
        qrCode: null,
        createdAt: new Date(),
      };

      const result = Payment.restore(paymentProps);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('ID is required');
      expect(result.value).toBeUndefined();
    });
  });

  describe('approve', () => {
    it('should approve a pending payment', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      }).value!;

      const result = payment.approve();

      expect(result.error).toBeUndefined();
      expect(payment.status).toBe(PaymentStatusEnum.APPROVED);
    });

    it('should fail to approve non-pending payment', () => {
      const payment = Payment.restore({
        id: 'payment-123',
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

      const result = payment.approve();

      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe(
        'Payment must be pending to be Approved',
      );
      expect(result.value).toBeUndefined();
    });

    it('should fail to approve refused payment', () => {
      const payment = Payment.restore({
        id: 'payment-123',
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

      const result = payment.approve();

      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe(
        'Payment must be pending to be Approved',
      );
      expect(payment.status).toBe(PaymentStatusEnum.REFUSED);
    });
  });

  describe('reject', () => {
    it('should reject a pending payment', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      }).value!;

      const result = payment.reject();

      expect(result.error).toBeUndefined();
      expect(payment.status).toBe(PaymentStatusEnum.REFUSED);
    });

    it('should fail to reject non-pending payment', () => {
      const payment = Payment.restore({
        id: 'payment-123',
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

      const result = payment.reject();

      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe(
        'Payment must be pending to be Rejected',
      );
      expect(payment.status).toBe(PaymentStatusEnum.APPROVED);
    });
  });

  describe('associateExternal', () => {
    it('should associate external payment successfully', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      }).value!;

      const result = payment.associateExternal(
        'ext-123',
        PaymentPlatformEnum.MP,
        null,
      );

      expect(result.error).toBeUndefined();
      expect(payment.externalId).toBe('ext-123');
      expect(payment.platform).toBe(PaymentPlatformEnum.MP);
      expect(payment.qrCode).toBeNull();
    });

    it('should associate external payment with QR code', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.QR,
      }).value!;

      const result = payment.associateExternal(
        'ext-456',
        PaymentPlatformEnum.FK,
        'qr-code-data',
      );

      expect(result.error).toBeUndefined();
      expect(payment.externalId).toBe('ext-456');
      expect(payment.platform).toBe(PaymentPlatformEnum.FK);
      expect(payment.qrCode).toBe('qr-code-data');
    });

    it('should not set QR code for non-QR payment types', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        storeId: 'store-123',
        total: 25.99,
        paymentType: PaymentTypeEnum.PIX,
      }).value!;

      const result = payment.associateExternal(
        'ext-789',
        PaymentPlatformEnum.SE,
        'should-not-be-set',
      );

      expect(result.error).toBeUndefined();
      expect(payment.externalId).toBe('ext-789');
      expect(payment.platform).toBe(PaymentPlatformEnum.SE);
      expect(payment.qrCode).toBeNull();
    });

    it('should fail to associate when already associated', () => {
      const payment = Payment.restore({
        id: 'payment-123',
        orderId: 'order-123',
        storeId: 'store-123',
        paymentType: PaymentTypeEnum.PIX,
        status: PaymentStatusEnum.PENDING,
        total: 25.99,
        platform: PaymentPlatformEnum.MP,
        externalId: 'existing-ext-id',
        qrCode: null,
        createdAt: new Date(),
      }).value!;

      const result = payment.associateExternal(
        'new-ext-id',
        PaymentPlatformEnum.SE,
        null,
      );

      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe(
        'Payment already associated with external source',
      );
      expect(payment.externalId).toBe('existing-ext-id');
      expect(payment.platform).toBe(PaymentPlatformEnum.MP);
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const paymentProps = {
        id: 'payment-123',
        orderId: 'order-456',
        storeId: 'store-789',
        paymentType: PaymentTypeEnum.CAR,
        status: PaymentStatusEnum.APPROVED,
        total: 99.99,
        platform: PaymentPlatformEnum.SE,
        externalId: 'ext-999',
        qrCode: 'qr-999',
        createdAt: new Date('2024-01-01'),
      };

      const payment = Payment.restore(paymentProps).value!;

      expect(payment.id).toBe('payment-123');
      expect(payment.orderId).toBe('order-456');
      expect(payment.storeId).toBe('store-789');
      expect(payment.paymentType).toBe(PaymentTypeEnum.CAR);
      expect(payment.status).toBe(PaymentStatusEnum.APPROVED);
      expect(payment.total).toBe(99.99);
      expect(payment.platform).toBe(PaymentPlatformEnum.SE);
      expect(payment.externalId).toBe('ext-999');
      expect(payment.qrCode).toBe('qr-999');
      expect(payment.createdAt).toEqual(new Date('2024-01-01'));
    });
  });
});
