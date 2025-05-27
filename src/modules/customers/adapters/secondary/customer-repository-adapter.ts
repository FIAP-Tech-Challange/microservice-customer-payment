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

  async create(customer: CustomerModel): Promise<void> {
    const entity = new CustomerEntity();
    entity.id = customer.id;
    entity.cpf = customer.cpf;
    entity.name = customer.name;
    entity.email = customer.email.toString();

    await this.customerRepository.save(entity);
  }
}
