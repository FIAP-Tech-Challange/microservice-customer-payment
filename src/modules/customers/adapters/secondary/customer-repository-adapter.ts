import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../models/entities/customer.entity';
import { CustomerRepositoryPort } from '../../ports/output/customer-repository.port';
import { CustomerModel } from '../../models/domain/customer.model';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async findByCpf(cpf: string): Promise<CustomerModel | null> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const customer = await this.customerRepository.findOne({
      where: { cpf: cleanCpf },
    });

    return customer ? customer.toModel() : null;
  }

  async create(customerData: Partial<CustomerModel>): Promise<CustomerModel> {
    const customerModel = CustomerModel.create({
      cpf: customerData.cpf!,
      name: customerData.name!,
      email: customerData.email!,
    });

    const customer = new CustomerEntity();
    customer.id = customerModel.id;
    customer.cpf = customerModel.cpf;
    customer.name = customerModel.name;
    customer.email = customerModel.email;

    const savedCustomer = await this.customerRepository.save(customer);
    return savedCustomer.toModel();
  }

  async findById(id: string): Promise<CustomerModel | null> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    return customer ? customer.toModel() : null;
  }

  async findAll(): Promise<CustomerModel[]> {
    const customers = await this.customerRepository.find({
      order: { name: 'ASC' },
    });

    return customers.map((customer) => customer.toModel());
  }
}
