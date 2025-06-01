/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../../src/modules/order/adapters/primary/order.controller';
import { OrderService } from '../../../../src/modules/order/services/order.service';
import { OrderModel } from '../../../../src/modules/order/models/domain/order.model';
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';
import { OrderStatusEnum } from '../../../../src/modules/order/models/enum/order-status.enum';
import { CreateOrderDto } from '../../../../src/modules/order/models/dto/create-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateOrderStatusDto } from '../../../../src/modules/order/models/dto/update-order-status.dto';
import { OrderRequestParamsDto } from '../../../../src/modules/order/models/dto/order-request-params.dto';
import { OrderResponseDto } from '../../../../src/modules/order/models/dto/order-response.dto';
import { OrderIdDto } from '../../../../src/modules/order/models/dto/order-id.dto';
import { OrderItemResponseDto } from '../../../../src/modules/order/models/dto/order-item-response.dto';
import { CustomerOrderDto } from '../../../../src/modules/order/models/dto/customer-order.dto';
import {
  RequestFromStore,
  RequestFromTotem,
} from '../../../../src/modules/auth/models/dtos/request.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderService: jest.Mocked<OrderService>;

  const mockOrderItem = OrderItemModel.restore({
    id: 'item-123',
    productId: 'product-123',
    unitPrice: 10.5,
    quantity: 2,
    createdAt: new Date(),
  });

  const mockOrderItems = [mockOrderItem];

  const mockOrder = OrderModel.restore({
    id: 'order-123',
    status: OrderStatusEnum.PENDING,
    storeId: 'store-123',
    totemId: 'totem-123',
    orderItems: mockOrderItems,
    createdAt: new Date(),
  });

  const createdAt = new Date();
  const mockOrderResponse: OrderResponseDto = {
    id: 'order-123',
    status: OrderStatusEnum.PENDING as string,
    totalPrice: 21.0,
    storeId: 'store-123',
    totemId: 'totem-123',
    createdAt: createdAt,
    orderItems: mockOrderItems.map((item) => {
      const dto = new OrderItemResponseDto();
      dto.id = item.id;
      dto.productId = item.productId;
      dto.quantity = item.quantity;
      dto.unitPrice = item.unitPrice;
      dto.totalPrice = item.subtotal;
      dto.createdAt = item.createdAt;
      return dto;
    }),
  };

  const mockRequest = {
    storeId: 'store-123',
    totemId: 'totem-123',
  } as RequestFromTotem;

  const mockStoreRequest = {
    storeId: 'store-123',
  } as RequestFromStore;

  beforeEach(async () => {
    mockOrderService = {
      create: jest.fn(),
      getAll: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
      deleteOrderItem: jest.fn(),
      updateCustomerId: jest.fn(),
    } as unknown as jest.Mocked<OrderService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  describe('create', () => {
    it('should create an order with items when valid data is provided', async () => {
      const createOrderDto: CreateOrderDto = {
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [
          {
            productId: 'product-123',
            quantity: 2,
          },
        ],
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto, mockRequest);

      expect(result).toEqual(mockOrderResponse);
      expect(mockOrderService.create).toHaveBeenCalledWith(
        createOrderDto,
        mockRequest.storeId,
        mockRequest.totemId,
      );
    });
  });

  describe('getAll', () => {
    it('should return all orders with pagination', async () => {
      const params: OrderRequestParamsDto = {
        page: 1,
        limit: 10,
        status: OrderStatusEnum.PENDING,
      };

      const mockPagination = {
        data: [mockOrder],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      mockOrderService.getAll.mockResolvedValue(mockPagination);

      const result = await controller.getAll(params, mockStoreRequest);

      expect(result).toEqual({
        data: [mockOrderResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      expect(mockOrderService.getAll).toHaveBeenCalledWith(
        params,
        mockStoreRequest.storeId,
      );
    });
  });

  describe('findById', () => {
    it('should return an order when found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.findById.mockResolvedValue(mockOrder);

      const result = await controller.findById(orderIdDto.id, mockStoreRequest);

      expect(result).toEqual(mockOrderResponse);
      expect(mockOrderService.findById).toHaveBeenCalledWith(
        orderIdDto.id,
        mockStoreRequest.storeId,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.findById.mockRejectedValue(
        new NotFoundException(`Order with id ${orderIdDto.id} not found`),
      );

      await expect(
        controller.findById(orderIdDto.id, mockStoreRequest),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.findById).toHaveBeenCalledWith(
        orderIdDto.id,
        mockStoreRequest.storeId,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: OrderStatusEnum.READY,
      };
      const updatedOrder = OrderModel.restore({
        ...mockOrder,
        status: OrderStatusEnum.READY,
        id: 'order-123',
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: mockOrderItems,
        createdAt: new Date(),
      });

      mockOrderService.updateStatus.mockResolvedValue(updatedOrder);

      const result = await controller.updateStatus(
        orderIdDto.id,
        updateOrderStatusDto,
        mockStoreRequest,
      );

      expect(result).toEqual({
        ...mockOrderResponse,
        status: OrderStatusEnum.READY as string,
      });
      expect(mockOrderService.updateStatus).toHaveBeenCalledWith(
        orderIdDto.id,
        updateOrderStatusDto.status,
        mockStoreRequest.storeId,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: OrderStatusEnum.READY,
      };
      mockOrderService.updateStatus.mockRejectedValue(
        new NotFoundException(`Order with id ${orderIdDto.id} not found`),
      );

      await expect(
        controller.updateStatus(
          orderIdDto.id,
          updateOrderStatusDto,
          mockStoreRequest,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.updateStatus).toHaveBeenCalledWith(
        orderIdDto.id,
        updateOrderStatusDto.status,
        mockStoreRequest.storeId,
      );
    });

    it('should throw BadRequestException when order cannot be updated', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: OrderStatusEnum.READY,
      };
      mockOrderService.updateStatus.mockRejectedValue(
        new BadRequestException(
          `Order with id ${orderIdDto.id} cannot be updated`,
        ),
      );

      await expect(
        controller.updateStatus(
          orderIdDto.id,
          updateOrderStatusDto,
          mockStoreRequest,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockOrderService.updateStatus).toHaveBeenCalledWith(
        orderIdDto.id,
        updateOrderStatusDto.status,
        mockStoreRequest.storeId,
      );
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(orderIdDto.id, mockStoreRequest);

      expect(result).toBeUndefined();
      expect(mockOrderService.delete).toHaveBeenCalledWith(
        orderIdDto.id,
        mockStoreRequest.storeId,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.delete.mockRejectedValue(
        new NotFoundException(`Order with id ${orderIdDto.id} not found`),
      );

      await expect(
        controller.delete(orderIdDto.id, mockStoreRequest),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.delete).toHaveBeenCalledWith(
        orderIdDto.id,
        mockStoreRequest.storeId,
      );
    });

    it('should throw BadRequestException when order cannot be deleted', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.delete.mockRejectedValue(
        new BadRequestException(
          `Order with id ${orderIdDto.id} cannot be deleted`,
        ),
      );

      await expect(
        controller.delete(orderIdDto.id, mockStoreRequest),
      ).rejects.toThrow(BadRequestException);
      expect(mockOrderService.delete).toHaveBeenCalledWith(
        orderIdDto.id,
        mockStoreRequest.storeId,
      );
    });
  });

  describe('updateCustomerId', () => {
    it('should update customer ID for an order', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-123';

      const customerModel: CustomerOrderDto = {
        id: customerId,
        cpf: '12345678900',
        name: 'Test Customer',
        email: 'test@example.com',
      };

      const updatedOrder = OrderModel.restore({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        storeId: 'store-123',
        totemId: 'totem-123',
        customer: customerModel,
        orderItems: mockOrderItems,
        createdAt: new Date(),
      });

      mockOrderService.updateCustomerId.mockResolvedValue(updatedOrder);

      const result = await controller.updateCustomerId(
        orderId,
        customerId,
        mockStoreRequest,
      );

      expect(result).toEqual({
        ...mockOrderResponse,
        customer: customerModel,
      });
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
        mockStoreRequest.storeId,
      );
    });

    it('should throw BadRequestException when customer ID is empty', async () => {
      const orderId = 'order-123';
      const customerId = '';
      mockOrderService.updateCustomerId.mockRejectedValue(
        new BadRequestException('Customer ID is required'),
      );

      await expect(
        controller.updateCustomerId(orderId, customerId, mockStoreRequest),
      ).rejects.toThrow(BadRequestException);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
        mockStoreRequest.storeId,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-123';
      mockOrderService.updateCustomerId.mockRejectedValue(
        new NotFoundException(`Order with id ${orderId} not found`),
      );

      await expect(
        controller.updateCustomerId(orderId, customerId, mockStoreRequest),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
        mockStoreRequest.storeId,
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-123';
      mockOrderService.updateCustomerId.mockRejectedValue(
        new NotFoundException(`Customer with id ${customerId} not found`),
      );

      await expect(
        controller.updateCustomerId(orderId, customerId, mockStoreRequest),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
        mockStoreRequest.storeId,
      );
    });
  });
});
