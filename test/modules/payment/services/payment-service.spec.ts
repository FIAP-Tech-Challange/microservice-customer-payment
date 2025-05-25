/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../../../src/modules/payment/services/payment.service';
import { ConfigService } from '@nestjs/config';
import {
  PAYMENT_REPOSITORY_PORT,
  PAYMENT_PROVIDER_PORT,
} from '../../../../src/modules/payment/payment.tokens';
import { PaymentRepositoryPort } from '../../../../src/modules/payment/ports/output/payment.repository';
import { PaymentProviderPort } from '../../../../src/modules/payment/ports/output/payment.provider';
import { BadRequestException, Logger } from '@nestjs/common';
import { PaymentModel } from '../../../../src/modules/payment/models/domain/payment.model';
import { CreatePaymentDto } from '../../../../src/modules/payment/models/dto/create-payment.dto';
import { PaymentStatusEnum } from '../../../../src/modules/payment/models/enum/payment-status.enum';
import { PaymentPlataformEnum } from '../../../../src/modules/payment/models/enum/payment-plataform.enum';
import { PaymentTypeEnum } from '../../../../src/modules/payment/models/enum/payment-type.enum';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepositoryPort: PaymentRepositoryPort;
  let paymentProviderPort: PaymentProviderPort;
  let configService: ConfigService;

  const mockPayment = {
    id: 'payment-id-1',
    orderId: 'order-123',
    storeId: 'store-123',
    paymentType: PaymentTypeEnum.PIX,
    status: PaymentStatusEnum.PENDING,
    total: 99.99,
    externalId: 'ext-123',
    qrCode: 'qr-code-data',
    plataform: PaymentPlataformEnum.MP,
    createdAt: new Date(),
  } as PaymentModel;

  beforeEach(async () => {
    const paymentRepositoryMock = {
      savePayment: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const paymentProviderMock = {
      platformName: PaymentPlataformEnum.MP,
      paymentType: PaymentTypeEnum.PIX,
      createQrCode: jest.fn(),
      findTotemById: jest.fn(),
    };

    const configServiceMock = {
      get: jest.fn(),
    };

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PAYMENT_REPOSITORY_PORT,
          useValue: paymentRepositoryMock,
        },
        {
          provide: PAYMENT_PROVIDER_PORT,
          useValue: paymentProviderMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepositoryPort = module.get<PaymentRepositoryPort>(
      PAYMENT_REPOSITORY_PORT,
    );
    paymentProviderPort = module.get<PaymentProviderPort>(
      PAYMENT_PROVIDER_PORT,
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('savePayment', () => {
    it('should create payment successfully with QR code from provider', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
        storeId: 'store-123',
      };

      const mockQrCodeResponse = {
        qrCode: 'qr-code-data',
        id: 'ext-123',
      };

      jest
        .spyOn(paymentProviderPort, 'createQrCode')
        .mockResolvedValue(mockQrCodeResponse);
      jest.spyOn(configService, 'get').mockReturnValue('N'); // Disable fake provider
      jest
        .spyOn(paymentRepositoryPort, 'savePayment')
        .mockResolvedValue(mockPayment);

      const result = await service.savePayment(createPaymentDto);

      expect(paymentProviderPort.createQrCode).toHaveBeenCalledWith({
        orderId: createPaymentDto.orderId,
        title: `order_${createPaymentDto.orderId}`,
      });
      expect(paymentRepositoryPort.savePayment).toHaveBeenCalled();
      expect(result).toEqual(mockPayment);
    });

    it('should create and auto-approve payment when fake provider is enabled', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
        storeId: 'store-123',
      };

      const mockQrCodeResponse = {
        qrCode: 'qr-code-data',
        id: 'ext-123',
      };

      const approvedPayment = {
        ...mockPayment,
        status: PaymentStatusEnum.APPROVED,
      };

      jest
        .spyOn(paymentProviderPort, 'createQrCode')
        .mockResolvedValue(mockQrCodeResponse);
      jest.spyOn(configService, 'get').mockReturnValue('S'); // Enable fake provider
      jest
        .spyOn(paymentRepositoryPort, 'savePayment')
        .mockResolvedValue(mockPayment);
      jest
        .spyOn(paymentRepositoryPort, 'updateStatus')
        .mockResolvedValue(approvedPayment as PaymentModel);

      const result = await service.savePayment(createPaymentDto);

      expect(paymentProviderPort.createQrCode).toHaveBeenCalled();
      expect(paymentRepositoryPort.savePayment).toHaveBeenCalled();
      expect(paymentRepositoryPort.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatusEnum.APPROVED,
      );
      expect(result).toEqual(approvedPayment);
    });

    it('should throw BadRequestException when QR code creation fails', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
        storeId: 'store-123',
      };

      const mockQrCodeResponse = {
        qrCode: '',
        id: '',
      };

      jest
        .spyOn(paymentProviderPort, 'createQrCode')
        .mockResolvedValue(mockQrCodeResponse);

      await expect(service.savePayment(createPaymentDto)).rejects.toThrow(
        new BadRequestException('Error creating QR code for payment'),
      );
      expect(paymentProviderPort.createQrCode).toHaveBeenCalled();
      expect(paymentRepositoryPort.savePayment).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a payment by id successfully', async () => {
      const paymentId = 'payment-id-1';

      jest
        .spyOn(paymentRepositoryPort, 'findById')
        .mockResolvedValue(mockPayment);

      const result = await service.findById(paymentId);

      expect(paymentRepositoryPort.findById).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('updateStatus', () => {
    it('should update payment status successfully', async () => {
      const paymentId = 'payment-id-1';
      const newStatus = PaymentStatusEnum.APPROVED;

      const updatedPayment = { ...mockPayment, status: newStatus };

      jest
        .spyOn(paymentRepositoryPort, 'updateStatus')
        .mockResolvedValue(updatedPayment as PaymentModel);

      const result = await service.updateStatus(paymentId, newStatus);

      expect(paymentRepositoryPort.updateStatus).toHaveBeenCalledWith(
        paymentId,
        newStatus,
      );
      expect(result).toEqual(updatedPayment);
    });
  });
});
