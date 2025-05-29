/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepositoryAdapter } from '../../../../src/modules/order/adapters/secondary/order-repository.adapter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderEntity } from '../../../../src/modules/order/models/entities/order.entity';
import { OrderItemEntity } from '../../../../src/modules/order/models/entities/order-item.entity';
import { DeleteResult, Repository } from 'typeorm';
import { OrderModel } from '../../../../src/modules/order/models/domain/order.model';
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';
import { OrderStatusEnum } from '../../../../src/modules/order/models/enum/order-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CustomerEntity } from '../../../../src/modules/customers/models/entities/customer.entity';
import { CustomerInOrderModel } from '../../../../src/modules/order/models/domain/customer.model';

describe('OrderRepositoryAdapter', () => {
  let adapter: OrderRepositoryAdapter;
  let orderRepository: jest.Mocked<Repository<OrderEntity>>;
  let orderItemRepository: jest.Mocked<Repository<OrderItemEntity>>;

  const mockCustomerEntity = new CustomerEntity();
  mockCustomerEntity.id = 'customer-123';
  mockCustomerEntity.cpf = '12345678900';
  mockCustomerEntity.name = 'Test Customer';
  mockCustomerEntity.email = 'test@example.com';

  const mockOrderItemEntity: OrderItemEntity = {
    id: 'item-123',
    order_id: 'order-123',
    product_id: 'product-123',
    unit_price: 10.5,
    quantity: 2,
    subtotal: 21.0,
    created_at: new Date(),
    order: {} as OrderEntity,
  };

  const mockOrderEntity: OrderEntity = {
    id: 'order-123',
    customer_id: 'customer-123',
    status: OrderStatusEnum.PENDING,
    total_price: 21.0,
    store_id: 'store-123',
    totem_id: 'totem-123',
    created_at: new Date(),
    customer: mockCustomerEntity,
    order_items: [mockOrderItemEntity],
  };

  const mockOrderItem = OrderItemModel.fromProps({
    id: 'item-123',
    orderId: 'order-123',
    productId: 'product-123',
    unitPrice: 10.5,
    quantity: 2,
    subtotal: 21.0,
    createdAt: new Date(),
  });

  const mockCustomerInOrder = {
    id: 'customer-123',
    cpf: '12345678900',
    name: 'Test Customer',
    email: 'test@example.com',
  } as CustomerInOrderModel;

  const mockOrder = OrderModel.fromProps({
    id: 'order-123',
    status: OrderStatusEnum.PENDING,
    totalPrice: 21.0,
    storeId: 'store-123',
    totemId: 'totem-123',
    customer: mockCustomerInOrder,
    orderItems: [mockOrderItem],
    createdAt: new Date(),
  });

  beforeEach(async () => {
    orderRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<OrderEntity>>;

    orderItemRepository = {
      findOne: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<OrderItemEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryAdapter,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: orderRepository,
        },
        {
          provide: getRepositoryToken(OrderItemEntity),
          useValue: orderItemRepository,
        },
      ],
    }).compile();

    adapter = module.get<OrderRepositoryAdapter>(OrderRepositoryAdapter);
  });

  describe('saveOrder', () => {
    it('should save an order with items when valid data is provided', async () => {
      orderRepository.create.mockReturnValue(mockOrderEntity);
      orderRepository.save.mockResolvedValue(mockOrderEntity);

      const result = await adapter.saveOrder(mockOrder);

      expect(result).toBeDefined();
      expect(orderRepository.create).toHaveBeenCalled();
      expect(orderRepository.save).toHaveBeenCalled();
    });

    it('should throw error when order has no items', async () => {
      const orderWithoutItems = OrderModel.create({
        storeId: 'store-123',
        totemId: 'totem-123',
      });

      await expect(adapter.saveOrder(orderWithoutItems)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error when order has empty items array', async () => {
      const orderWithEmptyItems = OrderModel.fromProps({
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [],
        createdAt: new Date(),
      });

      await expect(adapter.saveOrder(orderWithEmptyItems)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should find an order by id', async () => {
      const orderId = 'order-123';
      orderRepository.findOne.mockResolvedValue(mockOrderEntity);

      const result = await adapter.findById(orderId);

      expect(result).toBeDefined();
      if (result !== null) {
        expect(result.id).toBe(orderId);
      }
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['order_items', 'customer'],
      });
    });

    it('should return null when order not found', async () => {
      const orderId = 'non-existent-order';
      orderRepository.findOne.mockResolvedValue(null);

      const result = await adapter.findById(orderId);

      expect(result).toBeNull();
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['order_items', 'customer'],
      });
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const orderId = 'order-123';
      const newStatus = OrderStatusEnum.READY;

      const updatedEntity = {
        ...mockOrderEntity,
        status: newStatus,
      };

      orderRepository.findOne.mockResolvedValue(mockOrderEntity);
      orderRepository.save.mockResolvedValue(updatedEntity);

      const result = await adapter.updateStatus(orderId, newStatus);

      expect(result).toBeDefined();
      if (result !== null) {
        expect(result.status).toBe(newStatus);
      }
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['order_items', 'customer'],
      });
      expect(orderRepository.save).toHaveBeenCalled();
    });

    it('should return null when order not found', async () => {
      const orderId = 'non-existent-order';
      const newStatus = OrderStatusEnum.READY;
      orderRepository.findOne.mockResolvedValue(null);

      const result = await adapter.updateStatus(orderId, newStatus);

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should get all orders with pagination', async () => {
      const page = 1;
      const limit = 10;
      const status = OrderStatusEnum.PENDING;
      const skip = (page - 1) * limit;

      orderRepository.findAndCount.mockResolvedValue([[mockOrderEntity], 1]);

      const result = await adapter.getAll(page, limit, status);

      expect(result).toBeDefined();
      expect(result.data.length).toBe(1);
      if (result.data[0] !== null) {
        expect(result.data[0].id).toBe(mockOrder.id);
      }
      expect(result.total).toBe(1);
      expect(orderRepository.findAndCount).toHaveBeenCalledWith({
        skip,
        take: limit,
        where: { status },
        relations: ['order_items', 'customer'],
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const orderId = 'order-123';
      const deleteResult: DeleteResult = { affected: 1, raw: {} };

      orderRepository.delete.mockResolvedValue(deleteResult);

      await adapter.delete(orderId);

      expect(orderRepository.delete).toHaveBeenCalledWith(orderId);
    });
  });

  describe('findOrderItem', () => {
    it('should find an order item', async () => {
      const orderItemId = 'item-123';

      const mockOrder = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        total_price: 21.0,
        store_id: 'store-123',
        totem_id: 'totem-123',
        created_at: new Date(),
        customer: mockCustomerEntity,
      } as OrderEntity;

      mockOrderItemEntity.order = mockOrder;
      orderItemRepository.findOne.mockResolvedValue(mockOrderItemEntity);

      const result = await adapter.findOrderItem(orderItemId);

      expect(result).toBeDefined();
      if (result !== null) {
        expect(result.id).toBe(mockOrder.id);
      }
      expect(orderItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderItemId },
        relations: ['order', 'order.customer'],
      });
    });

    it('should return null when order item not found', async () => {
      const orderItemId = 'non-existent-item';
      orderItemRepository.findOne.mockResolvedValue(null);

      const result = await adapter.findOrderItem(orderItemId);

      expect(result).toBeNull();
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item', async () => {
      const orderItemId = 'item-123';
      const deleteResult: DeleteResult = { affected: 1, raw: {} };

      orderItemRepository.findOne.mockResolvedValue(mockOrderItemEntity);
      orderItemRepository.delete.mockResolvedValue(deleteResult);

      await adapter.deleteOrderItem(orderItemId);

      expect(orderItemRepository.delete).toHaveBeenCalledWith(orderItemId);
    });

    it('should throw NotFoundException when order item not found', async () => {
      const orderItemId = 'non-existent-item';
      orderItemRepository.findOne.mockResolvedValue(null);

      await expect(adapter.deleteOrderItem(orderItemId)).rejects.toThrow(
        NotFoundException,
      );
      expect(orderItemRepository.delete).not.toHaveBeenCalled();
    });
  });
});
