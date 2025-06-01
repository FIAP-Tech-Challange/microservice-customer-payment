/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../../../src/modules/customers/adapters/primary/customer-controller';
import { CustomerService } from '../../../../src/modules/customers/services/customer.service';
import { CustomerModel } from '../../../../src/modules/customers/models/domain/customer.model';
import { CreateCustomerDto } from '../../../../src/modules/customers/models/dto/create-customer.dto';
import { FindCustomerByCpfDto } from '../../../../src/modules/customers/models/dto/find-customer-by-cpf.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CPF } from 'src/shared/domain/cpf.vo';
import { Email } from 'src/shared/domain/email.vo';
import { StoreOrTotemGuard } from '../../../../src/modules/auth/guards/store-or-totem.guard';

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
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('findByCpf', () => {
    it('should return a customer when valid CPF is provided', async () => {
      const findCustomerDto: FindCustomerByCpfDto = {
        cpf: mockCpf,
      };

      const mockCustomer = createMockCustomer();
      mockCustomerService.findByCpf.mockResolvedValue(mockCustomer);

      const result = await controller.findByCpf(findCustomerDto);

      expect(mockCustomerService.findByCpf).toHaveBeenCalledWith(
        findCustomerDto.cpf,
      );
      expect(result).toEqual({
        id: mockCustomer.id,
        cpf: mockCustomer.cpf.format(),
        name: mockCustomer.name,
        email: mockCustomer.email.toString(),
      });
    });

    it('should bubble up BadRequestException for invalid CPF format', async () => {
      const findCustomerDto: FindCustomerByCpfDto = {
        cpf: '123.456.789-00',
      };

      const error = new BadRequestException('Invalid CPF format');
      mockCustomerService.findByCpf.mockRejectedValue(error);

      await expect(controller.findByCpf(findCustomerDto)).rejects.toThrow(
        error,
      );
      expect(mockCustomerService.findByCpf).toHaveBeenCalledWith(
        findCustomerDto.cpf,
      );
    });

    it('should bubble up NotFoundException when customer is not found', async () => {
      const findCustomerDto: FindCustomerByCpfDto = {
        cpf: mockCpf,
      };

      const error = new NotFoundException(
        `Customer with CPF ${mockCpf} not found`,
      );
      mockCustomerService.findByCpf.mockRejectedValue(error);

      await expect(controller.findByCpf(findCustomerDto)).rejects.toThrow(
        error,
      );
      expect(mockCustomerService.findByCpf).toHaveBeenCalledWith(
        findCustomerDto.cpf,
      );
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
      expect(result).toEqual({
        id: mockCustomer.id,
        cpf: mockCustomer.cpf.format(),
        name: mockCustomer.name,
        email: mockCustomer.email.toString(),
      });
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
      expect(result).toEqual({
        id: mockCustomer.id,
        cpf: mockCustomer.cpf.format(),
        name: mockCustomer.name,
        email: mockCustomer.email.toString(),
      });
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
    it('should return an array of customers', async () => {
      const mockCustomer1 = createMockCustomer();
      const mockCustomer2 = CustomerModel.fromProps({
        id: '2',
        cpf: new CPF('12345678909'), // Using a valid CPF
        name: 'Another Customer',
        email: new Email('another@example.com'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockCustomers = [mockCustomer1, mockCustomer2];
      mockCustomerService.findAll.mockResolvedValue(mockCustomers);

      const result = await controller.findAll();

      expect(mockCustomerService.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockCustomer1.id,
        cpf: mockCustomer1.cpf.format(),
        name: mockCustomer1.name,
        email: mockCustomer1.email.toString(),
      });
      expect(result[1]).toEqual({
        id: mockCustomer2.id,
        cpf: mockCustomer2.cpf.format(),
        name: mockCustomer2.name,
        email: mockCustomer2.email.toString(),
      });
    });

    it('should return empty array if no customers exist', async () => {
      mockCustomerService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockCustomerService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
