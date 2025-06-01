/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderService } from '../../../../src/modules/order/services/order.service';
import { ORDER_REPOSITORY_PORT } from '../../../../src/modules/order/order.tokens';
import { CustomerService } from '../../../../src/modules/customers/services/customer.service';
import { ProductService } from '../../../../src/modules/categories/services/product.service';
import { OrderModel } from '../../../../src/modules/order/models/domain/order.model';
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';
import { OrderStatusEnum } from '../../../../src/modules/order/models/enum/order-status.enum';
import { CreateOrderDto } from '../../../../src/modules/order/models/dto/create-order.dto';

// Mocks
jest.mock('../../../../src/modules/order/models/domain/order.model');
jest.mock('../../../../src/modules/order/models/domain/order-item.model');

describe('OrderService', () => {
  let service: OrderService;
  let mockOrderRepository: jest.Mocked<any>;
  let mockCustomerService: jest.Mocked<any>;
  let mockProductService: jest.Mocked<any>;

  // Dados de mock para testes
  const mockStoreId = 'store-123';
  const mockTotemId = 'totem-123';
  const mockOrderId = 'order-123';
  const mockOrderItemId = 'item-123';
  const mockCustomerId = 'customer-123';

  const mockOrderItem = {
    id: mockOrderItemId,
    productId: 'product-123',
    unitPrice: 10.5,
    quantity: 2,
    subtotal: 21,
    createdAt: new Date(),
  };

  const mockOrder = {
    id: mockOrderId,
    storeId: mockStoreId,
    totemId: mockTotemId,
    status: OrderStatusEnum.PENDING,
    orderItems: [mockOrderItem],
    removeItem: jest.fn().mockReturnValue(mockOrderItem),
    associateCustomer: jest.fn(),
    setToReceived: jest.fn(),
    setToInProgress: jest.fn(),
    setToReady: jest.fn(),
    setToFinished: jest.fn(),
    setToCanceled: jest.fn(),
    totalPrice: 21,
  };

  const mockCustomer = {
    id: mockCustomerId,
    name: 'Test Customer',
    cpf: { toString: () => '12345678900' },
    email: { toString: () => 'test@example.com' },
  };

  const mockCreateOrderDto: CreateOrderDto = {
    orderItems: [{ productId: 'product-123', quantity: 2 }],
  };

  const mockProduct = {
    id: 'product-123',
    name: 'Test Product',
    price: 10.5,
  };

  beforeEach(async () => {
    mockOrderRepository = {
      save: jest.fn().mockResolvedValue(mockOrder),
      getAll: jest.fn(),
      findById: jest.fn(),
      findByOrderItemId: jest.fn(),
      updateStatus: jest.fn(),
      updateOrder: jest.fn(),
      delete: jest.fn(),
      findOrderItem: jest.fn(),
      deleteOrderItem: jest.fn(),
    };

    mockCustomerService = {
      findById: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    mockProductService = {
      findById: jest.fn().mockResolvedValue(mockProduct),
    };

    (OrderModel.create as jest.Mock).mockReturnValue(mockOrder);
    (OrderItemModel.create as jest.Mock).mockReturnValue(mockOrderItem);

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: ORDER_REPOSITORY_PORT,
          useValue: mockOrderRepository,
        },
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = moduleRef.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      // Arrange & Act
      const result = await service.create(
        mockCreateOrderDto,
        mockStoreId,
        mockTotemId,
      );

      // Assert
      expect(result).toBe(mockOrder);
      expect(OrderModel.create).toHaveBeenCalled();
      expect(OrderItemModel.create).toHaveBeenCalled();
      expect(mockProductService.findById).toHaveBeenCalledWith(
        'product-123',
        mockStoreId,
      );
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw NotFoundException if product is not found', async () => {
      // Arrange
      mockProductService.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        service.create(mockCreateOrderDto, mockStoreId, mockTotemId),
      ).rejects.toThrow(NotFoundException);

      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if OrderModel.create throws', async () => {
      // Arrange
      (OrderModel.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      // Act & Assert
      await expect(
        service.create(mockCreateOrderDto, mockStoreId, mockTotemId),
      ).rejects.toThrow(BadRequestException);

      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return paginated orders', async () => {
      const mockPaginatedData = {
        data: [mockOrder],
        total: 1,
        page: 1,
        limit: 10,
      };
      mockOrderRepository.getAll.mockResolvedValue(mockPaginatedData);

      const result = await service.getAll(
        { page: 1, limit: 10, status: OrderStatusEnum.PENDING },
        mockStoreId,
      );

      expect(result).toBe(mockPaginatedData);
      expect(mockOrderRepository.getAll).toHaveBeenCalledWith(
        1,
        10,
        OrderStatusEnum.PENDING,
        mockStoreId,
      );
    });

    it('should use default pagination values when not provided', async () => {
      const mockPaginatedData = {
        data: [mockOrder],
        total: 1,
        page: 1,
        limit: 10,
      };
      mockOrderRepository.getAll.mockResolvedValue(mockPaginatedData);

      await service.getAll({}, mockStoreId);

      expect(mockOrderRepository.getAll).toHaveBeenCalledWith(
        1,
        10,
        OrderStatusEnum.PENDING,
        mockStoreId,
      );
    });
  });

  describe('findById', () => {
    it('should return the order when it exists and belongs to the store', async () => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await service.findById(mockOrderId, mockStoreId);

      expect(result).toBe(mockOrder);
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(mockOrderId);
    });

    it('should throw BadRequestException when id is not provided', async () => {
      await expect(service.findById('', mockStoreId)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockOrderRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when order is not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(service.findById(mockOrderId, mockStoreId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when order does not belong to the store', async () => {
      mockOrderRepository.findById.mockResolvedValue({
        ...mockOrder,
        storeId: 'different-store-id',
      });

      await expect(service.findById(mockOrderId, mockStoreId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
    });

    it('should update order to RECEIVED status', async () => {
      await service.updateStatus(
        mockOrderId,
        OrderStatusEnum.RECEIVED,
        mockStoreId,
      );

      expect(mockOrder.setToReceived).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should update order to IN_PROGRESS status', async () => {
      await service.updateStatus(
        mockOrderId,
        OrderStatusEnum.IN_PROGRESS,
        mockStoreId,
      );

      expect(mockOrder.setToInProgress).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should update order to READY status', async () => {
      await service.updateStatus(
        mockOrderId,
        OrderStatusEnum.READY,
        mockStoreId,
      );

      expect(mockOrder.setToReady).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should update order to FINISHED status', async () => {
      await service.updateStatus(
        mockOrderId,
        OrderStatusEnum.FINISHED,
        mockStoreId,
      );

      expect(mockOrder.setToFinished).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should update order to CANCELED status', async () => {
      await service.updateStatus(
        mockOrderId,
        OrderStatusEnum.CANCELED,
        mockStoreId,
      );

      expect(mockOrder.setToCanceled).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw BadRequestException for invalid status', async () => {
      await expect(
        service.updateStatus(
          mockOrderId,
          'INVALID_STATUS' as OrderStatusEnum,
          mockStoreId,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
    });

    it('should delete an order with PENDING status', async () => {
      await service.delete(mockOrderId, mockStoreId);

      expect(mockOrderRepository.delete).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw BadRequestException when id is not provided', async () => {
      await expect(service.delete('', mockStoreId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when order status is not PENDING', async () => {
      mockOrderRepository.findById.mockResolvedValue({
        ...mockOrder,
        status: OrderStatusEnum.RECEIVED,
      });

      await expect(service.delete(mockOrderId, mockStoreId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteOrderItem', () => {
    beforeEach(() => {
      mockOrderRepository.findByOrderItemId.mockResolvedValue(mockOrder);
    });

    it('should delete order item and update order', async () => {
      const result = await service.deleteOrderItem(
        mockOrderItemId,
        mockStoreId,
      );

      expect(result).toBe(mockOrder);
      expect(mockOrder.removeItem).toHaveBeenCalledWith(mockOrderItemId);
      expect(mockOrderRepository.deleteOrderItem).toHaveBeenCalledWith(
        mockOrderItem,
        mockOrder.id,
      );
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw BadRequestException if removal fails', async () => {
      mockOrder.removeItem.mockImplementationOnce(() => {
        throw new Error('Cannot remove item');
      });

      await expect(
        service.deleteOrderItem(mockOrderItemId, mockStoreId),
      ).rejects.toThrow(BadRequestException);

      expect(mockOrderRepository.deleteOrderItem).not.toHaveBeenCalled();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateCustomerId', () => {
    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockCustomerService.findById.mockResolvedValue(mockCustomer);
    });

    it('should associate customer with order', async () => {
      const result = await service.updateCustomerId(
        mockOrderId,
        mockCustomerId,
        mockStoreId,
      );

      expect(result).toBe(mockOrder);
      expect(mockCustomerService.findById).toHaveBeenCalledWith(mockCustomerId);
      expect(mockOrder.associateCustomer).toHaveBeenCalledWith(mockCustomer);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw BadRequestException when customer is not found', async () => {
      mockCustomerService.findById.mockResolvedValueOnce(null);

      await expect(
        service.updateCustomerId(mockOrderId, mockCustomerId, mockStoreId),
      ).rejects.toThrow(BadRequestException);

      expect(mockOrder.associateCustomer).not.toHaveBeenCalled();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when associate customer fails', async () => {
      mockOrder.associateCustomer.mockImplementationOnce(() => {
        throw new Error('Association failed');
      });

      await expect(
        service.updateCustomerId(mockOrderId, mockCustomerId, mockStoreId),
      ).rejects.toThrow(BadRequestException);

      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });
  });
});
