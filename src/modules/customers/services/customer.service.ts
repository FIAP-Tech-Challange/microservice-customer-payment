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
import { validateCPF } from '../utils/cpf-validator';

@Injectable()
export class CustomerService implements CustomerInputPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_PORT)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async findByCpf(cpf: string): Promise<CustomerModel> {
    if (!validateCPF(cpf)) {
      throw new BadRequestException('Invalid CPF format');
    }

    const cleanCpf = cpf.replace(/\D/g, '');
    const customer = await this.customerRepository.findByCpf(cleanCpf);
    if (!customer) {
      throw new NotFoundException(`Customer with CPF ${cleanCpf} not found`);
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerModel> {
    if (!validateCPF(createCustomerDto.cpf)) {
      throw new BadRequestException('Invalid CPF format');
    }

    if (!createCustomerDto.name || createCustomerDto.name.length < 3) {
      throw new BadRequestException('Name must be at least 3 characters long');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!createCustomerDto.email || !emailRegex.test(createCustomerDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    const cleanCpf = createCustomerDto.cpf.replace(/\D/g, '');
    const existingCustomer = await this.customerRepository.findByCpf(cleanCpf);

    if (existingCustomer) {
      throw new ConflictException('Customer with this CPF already exists');
    }

    return this.customerRepository.create({
      cpf: cleanCpf,
      name: createCustomerDto.name,
      email: createCustomerDto.email,
    });
  }
}
