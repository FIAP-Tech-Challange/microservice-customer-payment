/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../../../../src/modules/customers/services/customer.service';
import { CustomerRepositoryPort } from '../../../../src/modules/customers/ports/output/customer-repository.port';
import { CUSTOMER_REPOSITORY_PORT } from '../../../../src/modules/customers/customers.tokens';
import { CustomerModel } from '../../../../src/modules/customers/models/customer.model';
import { CreateCustomerDto } from '../../../../src/modules/customers/models/dto/create-customer.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(async () => {
    mockRepository = {
      findByCpf: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CUSTOMER_REPOSITORY_PORT,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  describe('findByCpf', () => {
    it('should find a customer by CPF when valid formatted CPF is provided', async () => {
      const formattedCpf = '902.136.910-94';
      const cleanCpf = '90213691094';
      const expectedCustomer = new CustomerModel();
      expectedCustomer.id = '1';
      expectedCustomer.cpf = cleanCpf;
      expectedCustomer.name = 'Test Customer';
      expectedCustomer.email = 'test@example.com';
      mockRepository.findByCpf.mockResolvedValue(expectedCustomer);

      const result = await service.findByCpf(formattedCpf);

      expect(mockRepository.findByCpf).toHaveBeenCalledWith(cleanCpf);
      expect(result).toEqual(expectedCustomer);
    });

    it('should find a customer by CPF when valid unformatted CPF is provided', async () => {
      const cleanCpf = '90213691094';
      const expectedCustomer = new CustomerModel();
      expectedCustomer.id = '1';
      expectedCustomer.cpf = cleanCpf;
      expectedCustomer.name = 'Test Customer';
      expectedCustomer.email = 'test@example.com';
      mockRepository.findByCpf.mockResolvedValue(expectedCustomer);

      const result = await service.findByCpf(cleanCpf);

      expect(mockRepository.findByCpf).toHaveBeenCalledWith(cleanCpf);
      expect(result).toEqual(expectedCustomer);
    });

    it('should throw BadRequestException when invalid CPF is provided', async () => {
      const invalidCpf = '123.456.789-00';

      await expect(service.findByCpf(invalidCpf)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findByCpf).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when customer is not found', async () => {
      const validCpf = '902.136.910-94';
      const cleanCpf = '90213691094';
      mockRepository.findByCpf.mockResolvedValue(null);

      await expect(service.findByCpf(validCpf)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findByCpf).toHaveBeenCalledWith(cleanCpf);
    });
  });

  describe('create', () => {
    it('should create a customer when valid data is provided', async () => {
      const formattedCpf = '902.136.910-94';
      const createCustomerDto: CreateCustomerDto = {
        cpf: formattedCpf,
        name: 'Test Customer',
        email: 'test@example.com',
      };

      const cleanCpf = '90213691094';
      const createdCustomer = new CustomerModel();
      createdCustomer.id = '1';
      createdCustomer.cpf = cleanCpf;
      createdCustomer.name = 'Test Customer';
      createdCustomer.email = 'test@example.com';

      mockRepository.findByCpf.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdCustomer);

      const result = await service.create(createCustomerDto);

      expect(mockRepository.findByCpf).toHaveBeenCalledWith(cleanCpf);
      expect(mockRepository.create).toHaveBeenCalledWith({
        cpf: cleanCpf,
        name: 'Test Customer',
        email: 'test@example.com',
      });
      expect(result).toEqual(createdCustomer);
    });

    it('should throw BadRequestException when invalid CPF is provided', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: '123.456.789-00',
        name: 'Test Customer',
        email: 'test@example.com',
      };

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findByCpf).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when name is too short', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: '902.136.910-94',
        name: 'Ab',
        email: 'test@example.com',
      };

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findByCpf).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when email is invalid', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: '902.136.910-94',
        name: 'Test Customer',
        email: 'invalid-email',
      };

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findByCpf).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when CPF already exists', async () => {
      const formattedCpf = '902.136.910-94';
      const createCustomerDto: CreateCustomerDto = {
        cpf: formattedCpf,
        name: 'Test Customer',
        email: 'test@example.com',
      };

      const cleanCpf = '90213691094';
      const existingCustomer = new CustomerModel();
      existingCustomer.id = '1';
      existingCustomer.cpf = cleanCpf;
      existingCustomer.name = 'Existing Customer';
      existingCustomer.email = 'existing@example.com';

      mockRepository.findByCpf.mockResolvedValue(existingCustomer);

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findByCpf).toHaveBeenCalledWith(cleanCpf);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});
