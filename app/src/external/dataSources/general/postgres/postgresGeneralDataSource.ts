import { DataSource, In, Repository } from 'typeorm';
import { GeneralDataSource } from '../general.dataSource';
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { CustomerEntity } from './entities/customer.entity';

export class PostgresGeneralDataSource implements GeneralDataSource {
  private customerRepository: Repository<CustomerEntity>;

  constructor(private dataSource: DataSource) {
    this.customerRepository = this.dataSource.getRepository(CustomerEntity);
  }

  // --------------- CUSTOMER --------------- \\
  async findCustomerById(id: string): Promise<CustomerDataSourceDTO | null> {
    const costumer = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!costumer) return null;

    return {
      id: costumer.id,
      cpf: costumer.cpf,
      name: costumer.name,
      email: costumer.email,
      createdAt: costumer.createdAt?.toISOString(),
      updatedAt: costumer.updatedAt?.toISOString(),
    };
  }
  async findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null> {
    const costumer = await this.customerRepository.findOne({
      where: { cpf: cpf },
    });
    if (!costumer) return null;
    return {
      id: costumer.id,
      cpf: costumer.cpf,
      name: costumer.name,
      email: costumer.email,
      createdAt: costumer.createdAt?.toString(),
      updatedAt: costumer.updatedAt?.toString(),
    };
  }
  async findCustomerByEmail(
    email: string,
  ): Promise<CustomerDataSourceDTO | null> {
    const costumer = await this.customerRepository.findOne({
      where: { email: email },
    });
    if (!costumer) return null;
    return {
      id: costumer.id,
      cpf: costumer.cpf,
      name: costumer.name,
      email: costumer.email,
      createdAt: costumer.createdAt?.toString(),
      updatedAt: costumer.updatedAt?.toString(),
    };
  }
  async findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>> {
    if (!paginatedParams.page) paginatedParams.page = 1;
    if (!paginatedParams.limit) paginatedParams.limit = 10;

    const params: {
      where: Record<string, unknown>;
    } = {
      where: {},
    };

    if (filters.cpf) {
      params.where = { cpf: filters.cpf };
    }

    if (filters.name) {
      params.where = { ...params.where, name: filters.name };
    }

    if (filters.email) {
      params.where = { ...params.where, email: filters.email };
    }

    const costumers = await this.customerRepository.findAndCount({
      skip: (paginatedParams.page - 1) * paginatedParams.limit,
      take: paginatedParams.limit,
      where: params.where,
      order: { name: 'ASC' },
    });

    if (!costumers || costumers[0].length === 0) {
      return {
        data: [],
        total: 0,
        page: paginatedParams.page,
        limit: paginatedParams.limit,
        totalPages: 0,
      };
    }
    const costumersDTO = costumers[0].map((customer) => ({
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt.toString(),
      updatedAt: customer.updatedAt.toString(),
    }));

    return {
      data: costumersDTO,
      total: costumersDTO.length,
      page: paginatedParams.page,
      limit: paginatedParams.limit,
      totalPages: 0,
    };
  }
  async saveCustomer(customer: CustomerDataSourceDTO): Promise<void> {
    await this.customerRepository.save({
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt),
    });
  }

}
