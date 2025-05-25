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
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PaymentModel } from '../../../../src/modules/payment/models/domain/payment.model';
import { CreatePaymentDto } from '../../../../src/modules/payment/models/dto/create-payment.dto';
import { PaymentStatusEnum } from '../../../../src/modules/payment/models/enum/payment-status.enum';
import { PaymentPlataformEnum } from '../../../../src/modules/payment/models/enum/payment-plataform.enum';
import { PaymentTypeEnum } from '../../../../src/modules/payment/models/enum/payment-type.enum';
import { OrderService } from '../../../../src/modules/order/services/order.service';
import { OrderStatusEnum } from '../../../../src/modules/order/models/enum/order-status.enum';
import { OrderModel } from '../../../../src/modules/order/models/domain/order.model';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepositoryPort: PaymentRepositoryPort;
  let paymentProviderPort: PaymentProviderPort;
  let configService: ConfigService;
  let orderService: OrderService;

  const mockPayment = {
    id: 'payment-id-1',
    orderId: 'order-123',
    storeId: 'store-123',
    paymentType: PaymentTypeEnum.PIX,
    status: PaymentStatusEnum.PENDING,
    total: 99.99,
    externalId: 'ext-123',
    qrCode: 'qr-code-data',
    plataform: PaymentPlataformEnum.FK,
    createdAt: new Date(),
  } as PaymentModel;

  beforeEach(async () => {
    const paymentRepositoryMock = {
      savePayment: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const paymentProviderMock = {
      platformName: PaymentPlataformEnum.FK,
      paymentType: PaymentTypeEnum.PIX,
      createQrCode: jest.fn(),
      findTotemById: jest.fn(),
    };

    const configServiceMock = {
      get: jest.fn(),
    };

    const orderServiceMock = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
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
        {
          provide: OrderService,
          useValue: orderServiceMock,
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
    orderService = module.get<OrderService>(OrderService);
  });

  describe('savePayment', () => {
    it('should throw NotFoundException when order is not found', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'non-existent-order',
        storeId: 'store-123',
      };

      // Mock o orderService para retornar null (pedido não encontrado)
      jest
        .spyOn(orderService, 'findById')
        .mockResolvedValue(null as unknown as OrderModel);

      await expect(service.savePayment(createPaymentDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.savePayment(createPaymentDto)).rejects.toThrow(
        `Order ${createPaymentDto.orderId} not found`,
      );

      expect(orderService.findById).toHaveBeenCalledWith(
        createPaymentDto.orderId,
      );
      expect(paymentProviderPort.createQrCode).not.toHaveBeenCalled();
      expect(paymentRepositoryPort.savePayment).not.toHaveBeenCalled();
    });
    it('should create payment successfully with QR code from provider', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
        storeId: 'store-123',
      };

      const mockQrCodeResponse = {
        qrCode: 'qr-code-data',
        id: 'ext-123',
      };

      // Criar um mock adequado para OrderModel
      const mockOrder = {
        id: 'order-123',
        customerId: 'customer-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 99.99,
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [],
        createdAt: new Date(),
        validate: jest.fn(),
      } as unknown as OrderModel;

      jest.spyOn(orderService, 'findById').mockResolvedValue(mockOrder);
      jest
        .spyOn(paymentProviderPort, 'createQrCode')
        .mockResolvedValue(mockQrCodeResponse);
      jest.spyOn(configService, 'get').mockReturnValue('N'); // Disable fake provider
      jest
        .spyOn(paymentRepositoryPort, 'savePayment')
        .mockResolvedValue(mockPayment);

      const result = await service.savePayment(createPaymentDto);

      expect(orderService.findById).toHaveBeenCalledWith(
        createPaymentDto.orderId,
      );
      // O serviço parece estar adicionando os itens do pedido, então vamos ajustar a expectativa
      expect(paymentProviderPort.createQrCode).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: createPaymentDto.orderId,
          title: `order_${createPaymentDto.orderId}`,
          total: mockOrder.totalPrice,
        }),
      );
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

      // Criar um mock adequado para OrderModel
      const mockOrder = {
        id: 'order-123',
        customerId: 'customer-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 99.99,
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [],
        createdAt: new Date(),
        validate: jest.fn(),
      } as unknown as OrderModel;

      const approvedPayment = {
        ...mockPayment,
        status: PaymentStatusEnum.APPROVED,
      };

      jest.spyOn(orderService, 'findById').mockResolvedValue(mockOrder);
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

      expect(orderService.findById).toHaveBeenCalledWith(
        createPaymentDto.orderId,
      );
      // O serviço parece estar adicionando os itens do pedido, então vamos ajustar a expectativa
      expect(paymentProviderPort.createQrCode).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: createPaymentDto.orderId,
          title: `order_${createPaymentDto.orderId}`,
          total: mockOrder.totalPrice,
        }),
      );
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

      // Criar um mock adequado para OrderModel
      const mockOrder = {
        id: 'order-123',
        customerId: 'customer-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 99.99,
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [],
        createdAt: new Date(),
        validate: jest.fn(),
      } as unknown as OrderModel;

      const mockQrCodeResponse = {
        qrCode: '',
        id: '',
      };

      jest.spyOn(orderService, 'findById').mockResolvedValue(mockOrder);
      jest
        .spyOn(paymentProviderPort, 'createQrCode')
        .mockResolvedValue(mockQrCodeResponse);

      await expect(service.savePayment(createPaymentDto)).rejects.toThrow(
        new BadRequestException('Error creating QR code for payment'),
      );

      expect(orderService.findById).toHaveBeenCalledWith(
        createPaymentDto.orderId,
      );
      expect(paymentProviderPort.createQrCode).toHaveBeenCalled();
      expect(paymentRepositoryPort.savePayment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when order status is not PENDING', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
        storeId: 'store-123',
      };

      // Criar um mock de pedido com status diferente de PENDING
      const mockOrder = {
        id: 'order-123',
        customerId: 'customer-123',
        status: 'COMPLETED', // Status diferente de PENDING
        totalPrice: 99.99,
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [],
        createdAt: new Date(),
        validate: jest.fn(),
      } as unknown as OrderModel;

      jest.spyOn(orderService, 'findById').mockResolvedValue(mockOrder);

      await expect(service.savePayment(createPaymentDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.savePayment(createPaymentDto)).rejects.toThrow(
        'Payment cannot be created for orders with a status other than PENDING',
      );

      expect(orderService.findById).toHaveBeenCalledWith(
        createPaymentDto.orderId,
      );
      expect(paymentProviderPort.createQrCode).not.toHaveBeenCalled();
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

      // Mock do pedido associado ao pagamento
      const mockOrder = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        storeId: 'store-123',
        createdAt: new Date(),
      } as unknown as OrderModel;

      // Primeiro precisamos mockar o findById para retornar um pagamento existente
      jest
        .spyOn(paymentRepositoryPort, 'findById')
        .mockResolvedValue(mockPayment);

      // Mock para encontrar o pedido
      jest.spyOn(orderService, 'findById').mockResolvedValue(mockOrder);

      // Mock para atualizar o status do pedido
      jest.spyOn(orderService, 'updateStatus').mockResolvedValue(mockOrder);

      jest
        .spyOn(paymentRepositoryPort, 'updateStatus')
        .mockResolvedValue(updatedPayment as PaymentModel);

      const result = await service.updateStatus(paymentId, newStatus);

      expect(paymentRepositoryPort.findById).toHaveBeenCalledWith(paymentId);
      expect(orderService.findById).toHaveBeenCalledWith(mockPayment.orderId);
      expect(orderService.updateStatus).toHaveBeenCalled();
      expect(paymentRepositoryPort.updateStatus).toHaveBeenCalledWith(
        paymentId,
        newStatus,
      );
      expect(result).toEqual(updatedPayment);
    });
  });
});
