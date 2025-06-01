/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../../../src/modules/customers/adapters/primary/customer-controller';
import { CustomerService } from '../../../../src/modules/customers/services/customer.service';
import { CustomerModel } from '../../../../src/modules/customers/models/domain/customer.model';
import { CreateCustomerDto } from '../../../../src/modules/customers/models/dto/create-customer.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CPF } from '../../../../src/shared/domain/cpf.vo';
import { Email } from '../../../../src/shared/domain/email.vo';
import { StoreOrTotemGuard } from '../../../../src/modules/auth/guards/store-or-totem.guard';
import { CustomerRequestParamsDto } from '../../../../src/modules/customers/models/dto/customer-request-params.dto';
import { CustomerPaginationDto } from '../../../../src/modules/customers/models/dto/customer-pagination.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockCustomerService: jest.Mocked<CustomerService>;

  const mockCustomerId = '1';
  const mockCpf = '902.136.910-94';
  const mockEmailStr = 'test@example.com';
  const mockName = 'Test Customer';

  const createMockCustomer = () => {
    return CustomerModel.fromProps({
      id: mockCustomerId,
      cpf: new CPF('90213691094'),
      name: mockName,
      email: new Email(mockEmailStr),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  beforeEach(async () => {
    mockCustomerService = {
      findByCpf: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<CustomerService>;

    const mockStoreOrTotemGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    })
      .overrideGuard(StoreOrTotemGuard)
      .useValue(mockStoreOrTotemGuard)
      .compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('findByCpf', () => {
    it('should return a customer when valid CPF is provided', async () => {
      const mockCustomer = createMockCustomer();
      mockCustomerService.findByCpf.mockResolvedValue(mockCustomer);

      const result = await controller.findByCpf(mockCpf);

      expect(mockCustomerService.findByCpf).toHaveBeenCalledWith(mockCpf);
      expect(result).toEqual(mockCustomer);
    });

    it('should bubble up BadRequestException for invalid CPF format', async () => {
      const invalidCpf = '123.456.789-00';
      const error = new BadRequestException('Invalid CPF format');
      mockCustomerService.findByCpf.mockRejectedValue(error);

      await expect(controller.findByCpf(invalidCpf)).rejects.toThrow(error);
      expect(mockCustomerService.findByCpf).toHaveBeenCalledWith(invalidCpf);
    });

    it('should bubble up NotFoundException when customer is not found', async () => {
      const error = new NotFoundException(
        `Customer with CPF ${mockCpf} not found`,
      );
      mockCustomerService.findByCpf.mockRejectedValue(error);

      await expect(controller.findByCpf(mockCpf)).rejects.toThrow(error);
      expect(mockCustomerService.findByCpf).toHaveBeenCalledWith(mockCpf);
    });
  });

  describe('create', () => {
    it('should create a customer when valid data is provided', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: mockCpf,
        name: mockName,
        email: mockEmailStr,
      };

      const mockCustomer = createMockCustomer();
      mockCustomerService.create.mockResolvedValue(mockCustomer);

      const result = await controller.create(createCustomerDto);

      expect(mockCustomerService.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
      expect(result).toEqual(mockCustomer);
    });

    it('should bubble up BadRequestException for invalid input data', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: '123.456.789-00',
        name: mockName,
        email: mockEmailStr,
      };

      const error = new BadRequestException(
        'Invalid customer data: Invalid CPF',
      );
      mockCustomerService.create.mockRejectedValue(error);

      await expect(controller.create(createCustomerDto)).rejects.toThrow(error);
      expect(mockCustomerService.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
    });

    it('should bubble up ConflictException when customer with CPF already exists', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: mockCpf,
        name: mockName,
        email: mockEmailStr,
      };

      const error = new ConflictException(
        'Customer with this CPF already exists',
      );
      mockCustomerService.create.mockRejectedValue(error);

      await expect(controller.create(createCustomerDto)).rejects.toThrow(error);
      expect(mockCustomerService.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
    });
  });

  describe('findById', () => {
    it('should return a customer when valid ID is provided', async () => {
      const mockCustomer = createMockCustomer();
      mockCustomerService.findById.mockResolvedValue(mockCustomer);

      const result = await controller.findById(mockCustomerId);

      expect(mockCustomerService.findById).toHaveBeenCalledWith(mockCustomerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should bubble up NotFoundException when customer is not found', async () => {
      const error = new NotFoundException(
        `Customer with ID ${mockCustomerId} not found`,
      );
      mockCustomerService.findById.mockRejectedValue(error);

      await expect(controller.findById(mockCustomerId)).rejects.toThrow(error);
      expect(mockCustomerService.findById).toHaveBeenCalledWith(mockCustomerId);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const params: CustomerRequestParamsDto = {
        page: 1,
        limit: 10,
      };

      const mockCustomer1 = createMockCustomer();
      const mockCustomer2 = CustomerModel.fromProps({
        id: '2',
        cpf: new CPF('12345678909'),
        name: 'Another Customer',
        email: new Email('another@example.com'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockCustomers = [mockCustomer1, mockCustomer2];
      const mockPagination: CustomerPaginationDto = {
        data: mockCustomers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      mockCustomerService.findAll.mockResolvedValue(mockPagination);

      const result = await controller.findAll(params);

      expect(mockCustomerService.findAll).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockPagination);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual(mockCustomer1);
      expect(result.data[1]).toEqual(mockCustomer2);
    });

    it('should return empty data array when no customers exist', async () => {
      const params: CustomerRequestParamsDto = {
        page: 1,
        limit: 10,
      };

      const mockPagination: CustomerPaginationDto = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      mockCustomerService.findAll.mockResolvedValue(mockPagination);

      const result = await controller.findAll(params);

      expect(mockCustomerService.findAll).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockPagination);
      expect(result.data).toEqual([]);
    });
  });
});
