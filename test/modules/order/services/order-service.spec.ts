import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../../../src/modules/order/services/order.service';
import { ORDER_REPOSITORY_PORT } from '../../../../src/modules/order/order.tokens';
import { CustomerService } from '../../../../src/modules/customers/services/customer.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const mockRepositoryValue = {
      saveOrder: jest.fn(),
      getAll: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      updateOrder: jest.fn(),
      delete: jest.fn(),
      findOrderItem: jest.fn(),
      deleteOrderItem: jest.fn(),
    };

    const mockCustomerServiceValue = {
      findById: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: ORDER_REPOSITORY_PORT,
          useValue: mockRepositoryValue,
        },
        {
          provide: CustomerService,
          useValue: mockCustomerServiceValue,
        },
      ],
    }).compile();

    service = moduleRef.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
