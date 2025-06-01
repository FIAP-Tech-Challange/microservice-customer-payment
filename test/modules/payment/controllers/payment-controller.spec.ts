/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../../../src/modules/payment/adapters/primary/payment.controller';
import { PaymentService } from '../../../../src/modules/payment/services/payment.service';
import { CreatePaymentDto } from '../../../../src/modules/payment/models/dto/create-payment.dto';
import { UpdateStatusPaymentDto } from '../../../../src/modules/payment/models/dto/update-status-payment.dto';
import { PaymentStatusEnum } from '../../../../src/modules/payment/models/enum/payment-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentModel } from '../../../../src/modules/payment/models/domain/payment.model';
import { PaymentPlataformEnum } from '../../../../src/modules/payment/models/enum/payment-plataform.enum';
import { PaymentTypeEnum } from '../../../../src/modules/payment/models/enum/payment-type.enum';
import {
  RequestFromStore,
  RequestFromStoreOrTotem,
} from '../../../../src/modules/auth/models/dtos/request.dto';
import { StoreOrTotemGuard } from '../../../../src/modules/auth/guards/store-or-totem.guard';
import { ApiKeyGuard } from '../../../../src/modules/auth/guards/api-key.guard';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;

  const mockRequest = {
    storeId: 'store-123',
    totemId: 'totem-123',
    totemAccessToken: 'token-123',
  } as unknown as RequestFromStoreOrTotem;

  const mockStoreRequest = {
    storeId: 'store-123',
  } as unknown as RequestFromStore;

  const mockPayment = {
    id: 'payment-id-1',
    orderId: 'order-123',
    storeId: 'store-123',
    paymentType: PaymentTypeEnum.PIX,
    status: PaymentStatusEnum.PENDING,
    externalId: 'ext-123',
    qrCode: 'qr-code-data',
    plataform: PaymentPlataformEnum.MP,
    createdAt: new Date(),
  } as PaymentModel;

  beforeEach(async () => {
    const paymentServiceMock = {
      savePayment: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const mockStoreOrTotemGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const mockApiKeyGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: paymentServiceMock,
        },
      ],
    })
      .overrideGuard(StoreOrTotemGuard)
      .useValue(mockStoreOrTotemGuard)
      .overrideGuard(ApiKeyGuard)
      .useValue(mockApiKeyGuard)
      .compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('create', () => {
    it('should create a payment successfully', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
      };

      jest.spyOn(paymentService, 'savePayment').mockResolvedValue(mockPayment);

      const result = await controller.create(createPaymentDto, mockRequest);

      expect(paymentService.savePayment).toHaveBeenCalledWith(
        createPaymentDto,
        mockRequest.storeId,
      );
      expect(result).toEqual(mockPayment);
    });

    it('should throw BadRequestException when payment creation fails', async () => {
      const createPaymentDto: CreatePaymentDto = {
        orderId: 'order-123',
      };

      const error = new BadRequestException('Error creating payment');
      jest.spyOn(paymentService, 'savePayment').mockRejectedValue(error);

      await expect(
        controller.create(createPaymentDto, mockRequest),
      ).rejects.toThrow(error);
      expect(paymentService.savePayment).toHaveBeenCalledWith(
        createPaymentDto,
        mockRequest.storeId,
      );
    });
  });

  describe('findById', () => {
    it('should find a payment by id successfully', async () => {
      const paymentIdDto = { id: 'payment-id-1' };

      jest.spyOn(paymentService, 'findById').mockResolvedValue(mockPayment);

      const result = await controller.findById(paymentIdDto);

      expect(paymentService.findById).toHaveBeenCalledWith(paymentIdDto.id);
      expect(result).toEqual(mockPayment);
    });

    it('should throw NotFoundException when payment is not found', async () => {
      const paymentIdDto = { id: 'non-existent-id' };

      const error = new NotFoundException('Payment not found');
      jest.spyOn(paymentService, 'findById').mockRejectedValue(error);

      await expect(controller.findById(paymentIdDto)).rejects.toThrow(error);
      expect(paymentService.findById).toHaveBeenCalledWith(paymentIdDto.id);
    });
  });

  describe('updateStatus', () => {
    it('should update payment status successfully', async () => {
      const id = 'payment-id-1';
      const updateStatusDto: UpdateStatusPaymentDto = {
        status: PaymentStatusEnum.APPROVED,
      };

      const updatedPayment = {
        ...mockPayment,
        status: PaymentStatusEnum.APPROVED,
      };
      jest
        .spyOn(paymentService, 'updateStatus')
        .mockResolvedValue(updatedPayment as PaymentModel);

      const result = await controller.updateStatus(
        id,
        updateStatusDto,
        mockStoreRequest,
      );

      expect(paymentService.updateStatus).toHaveBeenCalledWith(
        id,
        updateStatusDto.status,
        mockStoreRequest.storeId,
      );
      expect(result).toEqual(updatedPayment);
    });

    it('should throw BadRequestException when status update fails', async () => {
      const id = 'payment-id-1';
      const updateStatusDto: UpdateStatusPaymentDto = {
        status: PaymentStatusEnum.APPROVED,
      };

      const error = new BadRequestException('Error updating payment status');
      jest.spyOn(paymentService, 'updateStatus').mockRejectedValue(error);

      await expect(
        controller.updateStatus(id, updateStatusDto, mockStoreRequest),
      ).rejects.toThrow(error);
      expect(paymentService.updateStatus).toHaveBeenCalledWith(
        id,
        updateStatusDto.status,
        mockStoreRequest.storeId,
      );
    });
  });
});
