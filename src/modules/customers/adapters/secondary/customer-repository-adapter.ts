import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../models/entities/customer.entity';
import { CustomerRepositoryPort } from '../../ports/output/customer-repository.port';
import { CustomerModel } from '../../models/domain/customer.model';
import { CPF } from 'src/shared/domain/cpf.vo';
import { CustomerMapper } from '../../models/customer.mapper';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async findByCpf(cpf: CPF): Promise<CustomerModel | null> {
    const customer = await this.customerRepository.findOne({
      where: { cpf: cpf.toString() },
    });

    return customer ? CustomerMapper.toDomain(customer) : null;
  }

  async create(customer: CustomerModel): Promise<void> {
    await this.customerRepository.save(CustomerMapper.toEntity(customer));
  }

  async findById(id: string): Promise<CustomerModel | null> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    return customer ? CustomerMapper.toDomain(customer) : null;
  }

  async findAll(): Promise<CustomerModel[]> {
    const customers = await this.customerRepository.find({
      order: { name: 'ASC' },
    });

    return customers.map((customer) => CustomerMapper.toDomain(customer));
  }
}
