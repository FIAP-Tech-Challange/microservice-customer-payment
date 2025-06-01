/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepositoryTypeORM } from '../../../../src/modules/order/adapters/secondary/order.repository.typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderEntity } from '../../../../src/modules/order/models/entities/order.entity';
import { OrderItemEntity } from '../../../../src/modules/order/models/entities/order-item.entity';
import { Repository } from 'typeorm';
import { OrderModel } from '../../../../src/modules/order/models/domain/order.model';
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';
import { OrderStatusEnum } from '../../../../src/modules/order/models/enum/order-status.enum';
import { CustomerEntity } from '../../../../src/modules/customers/models/entities/customer.entity';
import { CustomerModel } from '../../../../src/modules/customers/models/domain/customer.model';
import { OrderMapper } from '../../../../src/modules/order/models/mapper/order.mapper';

describe('OrderRepositoryTypeORM', () => {
  let repository: OrderRepositoryTypeORM;
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

  const mockOrderItem = OrderItemModel.restore({
    id: 'item-123',
    productId: 'product-123',
    unitPrice: 10.5,
    quantity: 2,
    createdAt: new Date(),
  });

  const mockCustomer = {
    id: 'customer-123',
    cpf: '12345678900',
    name: 'Test Customer',
    email: 'test@example.com',
  } as unknown as CustomerModel;

  const mockOrder = OrderModel.restore({
    id: 'order-123',
    status: OrderStatusEnum.PENDING,
    storeId: 'store-123',
    totemId: 'totem-123',
    customer: mockCustomer,
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
      remove: jest.fn(),
    } as unknown as jest.Mocked<Repository<OrderEntity>>;

    orderItemRepository = {
      findOne: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<Repository<OrderItemEntity>>;

    jest.spyOn(OrderMapper, 'toDomain').mockImplementation(() => mockOrder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryTypeORM,
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

    repository = module.get<OrderRepositoryTypeORM>(OrderRepositoryTypeORM);
  });

  describe('save', () => {
    it('should save an order with items when valid data is provided', async () => {
      orderRepository.save.mockResolvedValue(mockOrderEntity);

      await repository.save(mockOrder);

      expect(orderRepository.save).toHaveBeenCalled();
    });

    it('should validate that order requires at least one item', () => {
      expect(() => {
        OrderModel.restore({
          id: 'order-123',
          status: OrderStatusEnum.PENDING,
          storeId: 'store-123',
          totemId: 'totem-123',
          orderItems: [],
          createdAt: new Date(),
        });
      }).toThrow('Order must have at least one item');
    });
  });

  describe('findById', () => {
    it('should find an order by id', async () => {
      const orderId = 'order-123';
      orderRepository.findOne.mockResolvedValue(mockOrderEntity);

      const result = await repository.findById(orderId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(orderId);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['order_items', 'customer'],
      });
    });

    it('should return null when order not found', async () => {
      const orderId = 'non-existent-order';
      orderRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(orderId);

      expect(result).toBeNull();
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['order_items', 'customer'],
      });
    });
  });

  describe('getAll', () => {
    it('should get all orders with pagination', async () => {
      const page = 1;
      const limit = 10;
      const status = OrderStatusEnum.PENDING;
      const storeId = 'store-123';
      const skip = (page - 1) * limit;

      orderRepository.findAndCount.mockResolvedValue([[mockOrderEntity], 1]);

      const result = await repository.getAll(page, limit, status, storeId);

      expect(result).toBeDefined();
      expect(result.data.length).toBe(1);
      expect(result.data[0]?.id).toBe('order-123');
      expect(result.total).toBe(1);
      expect(orderRepository.findAndCount).toHaveBeenCalledWith({
        skip,
        take: limit,
        where: {
          store_id: storeId,
          ...(status ? { status } : {}),
        },
        relations: ['order_items', 'customer'],
        order: { created_at: 'DESC' },
      });
    });

    it('should return empty result when no orders found', async () => {
      const page = 1;
      const limit = 10;
      const status = OrderStatusEnum.PENDING;
      const storeId = 'store-123';

      orderRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await repository.getAll(page, limit, status, storeId);

      expect(result).toBeDefined();
      expect(result.data.length).toBe(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      orderRepository.remove.mockResolvedValue(mockOrderEntity);

      await repository.delete(mockOrder);

      expect(orderRepository.remove).toHaveBeenCalled();
    });
  });

  describe('findByOrderItemId', () => {
    it('should find an order by order item id', async () => {
      const orderItemId = 'item-123';

      mockOrderItemEntity.order = mockOrderEntity;
      orderItemRepository.findOne.mockResolvedValue(mockOrderItemEntity);

      const result = await repository.findByOrderItemId(orderItemId);

      expect(result).toBeDefined();
      expect(result?.id).toBe('order-123');
      expect(orderItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderItemId },
        relations: ['order', 'order.customer'],
      });
    });

    it('should return null when order item not found', async () => {
      const orderItemId = 'non-existent-item';
      orderItemRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByOrderItemId(orderItemId);

      expect(result).toBeNull();
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item', async () => {
      const orderItem = mockOrderItem;
      const orderId = 'order-123';

      orderItemRepository.remove.mockResolvedValue(mockOrderItemEntity);

      await repository.deleteOrderItem(orderItem, orderId);

      expect(orderItemRepository.remove).toHaveBeenCalled();
    });
  });
});
