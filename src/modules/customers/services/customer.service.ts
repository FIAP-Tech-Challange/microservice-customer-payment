import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../ports/output/customer-repository.port';
import { CustomerModel } from '../models/domain/customer.model';
import { CreateCustomerDto } from '../models/dto/create-customer.dto';
import { CUSTOMER_REPOSITORY_PORT } from '../customers.tokens';
import { CustomerInputPort } from '../ports/input/customer.port';
import { Email } from 'src/shared/domain/email.vo';
import { CPF } from 'src/shared/domain/cpf.vo';

@Injectable()
export class CustomerService implements CustomerInputPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_PORT)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async findByCpf(cpfValue: string): Promise<CustomerModel> {
    let cpf: CPF;

    try {
      cpf = new CPF(cpfValue);
    } catch {
      throw new BadRequestException('Invalid CPF format');
    }

    const customer = await this.customerRepository.findByCpf(cpf);
    if (!customer) {
      throw new NotFoundException(
        `Customer with CPF ${cpf.format()} not found`,
      );
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerModel> {
    let customer: CustomerModel;

    try {
      customer = CustomerModel.create({
        cpf: new CPF(createCustomerDto.cpf),
        name: createCustomerDto.name,
        email: new Email(createCustomerDto.email),
      });
    } catch (error) {
      throw new BadRequestException('Invalid customer data: ' + error.message);
    }

    const existingCustomer = await this.customerRepository.findByCpf(
      customer.cpf,
    );

    if (existingCustomer) {
      throw new ConflictException('Customer with this CPF already exists');
    }

    await this.customerRepository.create(customer);

    return customer;
  }
}
