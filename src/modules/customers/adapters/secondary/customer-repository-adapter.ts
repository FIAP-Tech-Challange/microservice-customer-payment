import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../models/entities/customer.entity';
import { CustomerRepositoryPort } from '../../ports/output/customer-repository.port';
import { CustomerModel } from '../../models/domain/customer.model';
import { CPF } from 'src/shared/domain/cpf.vo';
import { CustomerMapper } from '../../models/customer.mapper';
import { CustomerRequestParamsDto } from '../../models/dto/customer-request-params.dto';
import { CustomerPaginationDto } from '../../models/dto/customer-pagination.dto';

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

  async findAll(
    params: CustomerRequestParamsDto,
  ): Promise<CustomerPaginationDto> {
    if (!params.page) params.page = 1;
    if (!params.limit) params.limit = 10;

    const customers = await this.customerRepository.findAndCount({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      order: { name: 'ASC' },
    });

    if (!customers || customers[0].length === 0) {
      return {
        data: [],
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const customersModels = customers[0].map((customer) =>
      CustomerMapper.toDomain(customer),
    );

    return {
      data: customersModels,
      total: customers[1],
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(customers[1] / params.limit),
      hasNextPage: params.page * params.limit < customers[1],
      hasPreviousPage: params.page > 1,
    };
  }
}
