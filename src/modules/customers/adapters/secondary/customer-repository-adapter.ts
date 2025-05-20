import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../models/entities/customer.entity';
import { CustomerRepositoryPort } from '../../ports/output/customer-repository.port';
import { CustomerModel } from '../../models/customer.model';

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
    const customer = new CustomerEntity();
    customer.cpf = customerData.cpf!;
    customer.name = customerData.name!;
    customer.email = customerData.email!;

    const savedCustomer = await this.customerRepository.save(customer);
    return savedCustomer.toModel();
  }
}
