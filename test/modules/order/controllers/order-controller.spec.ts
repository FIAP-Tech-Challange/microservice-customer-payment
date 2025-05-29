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
import { OrderPaginationDto } from '../../../../src/modules/order/models/dto/order-pagination.dto';
import { OrderResponseDto } from '../../../../src/modules/order/models/dto/order-response.dto';
import { OrderIdDto } from '../../../../src/modules/order/models/dto/order-id.dto';
import { OrderItemResponseDto } from '../../../../src/modules/order/models/dto/order-item-response.dto';
import { CustomerInOrderModel } from '../../../../src/modules/order/models/domain/customer.model';

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderService: jest.Mocked<OrderService>;

  const mockOrderItem = OrderItemModel.fromProps({
    id: 'item-123',
    orderId: 'order-123',
    productId: 'product-123',
    unitPrice: 10.5,
    quantity: 2,
    subtotal: 21.0,
    createdAt: new Date(),
  });

  const mockOrderItems = [mockOrderItem];

  const mockOrder = OrderModel.fromProps({
    id: 'order-123',
    status: OrderStatusEnum.PENDING,
    totalPrice: 21.0,
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
      dto.orderId = item.orderId;
      dto.productId = item.productId;
      dto.quantity = item.quantity;
      dto.unitPrice = item.unitPrice;
      dto.totalPrice = item.subtotal;
      dto.createdAt = item.createdAt;
      return dto;
    }),
  };

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
            unitPrice: 10.5,
          },
        ],
      };

      mockOrderService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(mockOrderService.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('getAll', () => {
    it('should return all orders with pagination', async () => {
      const params: OrderRequestParamsDto = {
        page: 1,
        limit: 10,
        status: OrderStatusEnum.PENDING,
      };

      const mockPagination: OrderPaginationDto = {
        data: [mockOrderResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      mockOrderService.getAll.mockResolvedValue(mockPagination);

      const result = await controller.getAll(params);

      expect(result).toEqual(mockPagination);
      expect(mockOrderService.getAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findById', () => {
    it('should return an order when found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.findById.mockResolvedValue(mockOrder);

      const result = await controller.findById(orderIdDto);

      expect(result).toEqual(mockOrder);
      expect(mockOrderService.findById).toHaveBeenCalledWith(orderIdDto.id);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.findById.mockRejectedValue(
        new NotFoundException(`Order with id ${orderIdDto.id} not found`),
      );

      await expect(controller.findById(orderIdDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockOrderService.findById).toHaveBeenCalledWith(orderIdDto.id);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: OrderStatusEnum.READY,
      };
      const updatedOrder = OrderModel.fromProps({
        ...mockOrder,
        status: OrderStatusEnum.READY,
      });

      mockOrderService.updateStatus.mockResolvedValue(updatedOrder);

      const result = await controller.updateStatus(
        orderIdDto,
        updateOrderStatusDto,
      );

      expect(result).toEqual(updatedOrder);
      expect(mockOrderService.updateStatus).toHaveBeenCalledWith(
        orderIdDto.id,
        updateOrderStatusDto.status,
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
        controller.updateStatus(orderIdDto, updateOrderStatusDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.updateStatus).toHaveBeenCalledWith(
        orderIdDto.id,
        updateOrderStatusDto.status,
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
        controller.updateStatus(orderIdDto, updateOrderStatusDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockOrderService.updateStatus).toHaveBeenCalledWith(
        orderIdDto.id,
        updateOrderStatusDto.status,
      );
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(orderIdDto);

      expect(result).toBeUndefined();
      expect(mockOrderService.delete).toHaveBeenCalledWith(orderIdDto.id);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.delete.mockRejectedValue(
        new NotFoundException(`Order with id ${orderIdDto.id} not found`),
      );

      await expect(controller.delete(orderIdDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockOrderService.delete).toHaveBeenCalledWith(orderIdDto.id);
    });

    it('should throw BadRequestException when order cannot be deleted', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-123' };
      mockOrderService.delete.mockRejectedValue(
        new BadRequestException(
          `Order with id ${orderIdDto.id} cannot be deleted`,
        ),
      );

      await expect(controller.delete(orderIdDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockOrderService.delete).toHaveBeenCalledWith(orderIdDto.id);
    });
  });

  describe('updateCustomerId', () => {
    it('should update customer ID for an order', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-123';

      const customerModel: CustomerInOrderModel = {
        id: customerId,
        cpf: '12345678900',
        name: 'Test Customer',
        email: 'test@example.com',
      };

      const updatedOrder = OrderModel.fromProps({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        totalPrice: 21.0,
        storeId: 'store-123',
        totemId: 'totem-123',
        customer: customerModel,
        orderItems: mockOrderItems,
        createdAt: new Date(),
      });

      mockOrderService.updateCustomerId.mockResolvedValue(updatedOrder);

      const result = await controller.updateCustomerId(orderId, customerId);

      expect(result).toEqual(updatedOrder);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
      );
    });

    it('should throw BadRequestException when customer ID is empty', async () => {
      const orderId = 'order-123';
      const customerId = '';
      mockOrderService.updateCustomerId.mockRejectedValue(
        new BadRequestException('Customer ID is required'),
      );

      await expect(
        controller.updateCustomerId(orderId, customerId),
      ).rejects.toThrow(BadRequestException);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-123';
      mockOrderService.updateCustomerId.mockRejectedValue(
        new NotFoundException(`Order with id ${orderId} not found`),
      );

      await expect(
        controller.updateCustomerId(orderId, customerId),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-123';
      mockOrderService.updateCustomerId.mockRejectedValue(
        new NotFoundException(`Customer with id ${customerId} not found`),
      );

      await expect(
        controller.updateCustomerId(orderId, customerId),
      ).rejects.toThrow(NotFoundException);
      expect(mockOrderService.updateCustomerId).toHaveBeenCalledWith(
        orderId,
        customerId,
      );
    });
  });
});
