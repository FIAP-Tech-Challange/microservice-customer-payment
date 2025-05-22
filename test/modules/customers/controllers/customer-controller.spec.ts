/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../../../src/modules/customers/adapters/primary/customer-controller';
import { CustomerInputPort } from '../../../../src/modules/customers/ports/input/customer.port';
import { CUSTOMER_INPUT_PORT } from '../../../../src/modules/customers/customers.tokens';
import { CustomerModel } from '../../../../src/modules/customers/models/domain/customer.model';
import { CreateCustomerDto } from '../../../../src/modules/customers/models/dto/create-customer.dto';
import { FindCustomerByCpfDto } from '../../../../src/modules/customers/models/dto/find-customer-by-cpf.dto';
import { BadRequestException } from '@nestjs/common';

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockCustomerInputPort: jest.Mocked<CustomerInputPort>;

  beforeEach(async () => {
    mockCustomerInputPort = {
      findByCpf: jest
        .fn()
        .mockImplementation(async () => Promise.resolve(null)),
      create: jest.fn().mockImplementation(async () => Promise.resolve(null)),
    } as jest.Mocked<CustomerInputPort>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CUSTOMER_INPUT_PORT,
          useValue: mockCustomerInputPort,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('findByCpf', () => {
    it('should return a customer when valid CPF is provided', async () => {
      const findCustomerDto: FindCustomerByCpfDto = {
        cpf: '902.136.910-94',
      };

      const mockCustomer = CustomerModel.fromProps({
        id: '1',
        cpf: '90213691094',
        name: 'Test Customer',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const findByCpfMock = mockCustomerInputPort.findByCpf;
      findByCpfMock.mockResolvedValue(mockCustomer);

      const result = await controller.findByCpf(findCustomerDto);

      expect(findByCpfMock).toHaveBeenCalledWith(findCustomerDto.cpf);
      expect(result).toEqual({
        id: mockCustomer.id,
        cpf: mockCustomer.cpf,
        name: mockCustomer.name,
        email: mockCustomer.email,
      });
    });

    it('should bubble up exceptions from the service', async () => {
      const findCustomerDto: FindCustomerByCpfDto = {
        cpf: '123.456.789-00',
      };

      const error = new BadRequestException('Invalid CPF format');
      mockCustomerInputPort.findByCpf.mockRejectedValue(error);

      await expect(controller.findByCpf(findCustomerDto)).rejects.toThrow(
        error,
      );
      expect(mockCustomerInputPort.findByCpf).toHaveBeenCalledWith(
        findCustomerDto.cpf,
      );
    });
  });

  describe('create', () => {
    it('should create a customer when valid data is provided', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: '902.136.910-94',
        name: 'Test Customer',
        email: 'test@example.com',
      };

      const mockCustomer = CustomerModel.fromProps({
        id: '1',
        cpf: '90213691094',
        name: 'Test Customer',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockCustomerInputPort.create.mockResolvedValue(mockCustomer);

      const result = await controller.create(createCustomerDto);

      expect(mockCustomerInputPort.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
      expect(result).toEqual({
        id: mockCustomer.id,
        cpf: mockCustomer.cpf,
        name: mockCustomer.name,
        email: mockCustomer.email,
      });
    });

    it('should bubble up exceptions from the service', async () => {
      const createCustomerDto: CreateCustomerDto = {
        cpf: '123.456.789-00',
        name: 'Test Customer',
        email: 'test@example.com',
      };

      const error = new BadRequestException('Invalid CPF format');
      mockCustomerInputPort.create.mockRejectedValue(error);

      await expect(controller.create(createCustomerDto)).rejects.toThrow(error);
      expect(mockCustomerInputPort.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
    });
  });
});
