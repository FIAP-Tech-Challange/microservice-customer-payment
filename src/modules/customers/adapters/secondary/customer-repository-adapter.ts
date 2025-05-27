import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../models/entities/customer.entity';
import { CustomerRepositoryPort } from '../../ports/output/customer-repository.port';
import { CustomerModel } from '../../models/domain/customer.model';
import { CPF } from 'src/shared/domain/cpf.vo';

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

    return customer ? customer.toModel() : null;
  }

  async create(customer: CustomerModel): Promise<void> {
    const entity = new CustomerEntity();
    entity.id = customer.id;
    entity.cpf = customer.cpf.toString();
    entity.name = customer.name;
    entity.email = customer.email.toString();

    await this.customerRepository.save(entity);
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
