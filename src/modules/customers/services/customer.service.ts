import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../ports/output/customer-repository.port';
import { CustomerModel } from '../models/domain/customer.model';
import { CreateCustomerDto } from '../models/dto/create-customer.dto';
import { CUSTOMER_REPOSITORY_PORT } from '../customers.tokens';
import { Email } from 'src/shared/domain/email.vo';
import { CPF } from 'src/shared/domain/cpf.vo';
import { CustomerRequestParamsDto } from '../models/dto/customer-request-params.dto';
import { CustomerPaginationDto } from '../models/dto/customer-pagination.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);
  constructor(
    @Inject(CUSTOMER_REPOSITORY_PORT)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async findByCpf(cpfValue: string): Promise<CustomerModel> {
    this.logger.log(`Searching for customers by cpf`);
    let cpf: CPF;

    try {
      cpf = new CPF(cpfValue);
    } catch (error) {
      this.logger.log(`Error CPF ${error.message}`);
      throw new BadRequestException(`Error CPF ${error.message}`);
    }

    const customer = await this.customerRepository.findByCpf(cpf);
    if (!customer) {
      this.logger.log(`Customer with CPF ${cpf.format()} not found`);
      throw new NotFoundException(
        `Customer with CPF ${cpf.format()} not found`,
      );
    }
    this.logger.log('Customer found successfully');
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerModel> {
    this.logger.log(`Creating Customer ${createCustomerDto.name}`);
    let customer: CustomerModel;

    try {
      customer = CustomerModel.create({
        cpf: new CPF(createCustomerDto.cpf),
        name: createCustomerDto.name,
        email: new Email(createCustomerDto.email),
      });
    } catch (error) {
      this.logger.log(`Invalid customer data ${error.mesage}`);
      throw new BadRequestException('Invalid customer data: ' + error.message);
    }

    const existingCustomer = await this.customerRepository.findByCpf(
      customer.cpf,
    );

    if (existingCustomer) {
      this.logger.log(`Customer with this CPF already exists`);
      throw new ConflictException('Customer with this CPF already exists');
    }

    await this.customerRepository.create(customer);
    this.logger.log(`Customer created successfully`);
    return customer;
  }

  async findById(id: string): Promise<CustomerModel> {
    this.logger.log(`Finding Customer by id ${id}`);
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      this.logger.log(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    this.logger.log(`Customer id ${id} found successfully`);
    return customer;
  }

  async findAll(
    params: CustomerRequestParamsDto,
  ): Promise<CustomerPaginationDto> {
    this.logger.log(`Fetching all Customers`);

    const customers = await this.customerRepository.findAll(params);

    this.logger.log(`Found ${customers?.total} Customers`);

    if (customers.total === 0) {
      throw new NotFoundException(`Customers not found`);
    }

    return customers;
  }
}
