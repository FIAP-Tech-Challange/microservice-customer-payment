import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Customer } from '../entities/customer.entity';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CustomerMapper } from '../mappers/customer.mapper';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedResponse } from 'src/core/common/DTOs/paginatedResponse.dto';

export class CustomerGateway {
  constructor(private dataSource: DataSource) {}

  async findCustomerById(id: string): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerById(id);
    if (!customerDataSourceDTO) return { error: undefined, value: null };

    return CustomerMapper.toEntity(customerDataSourceDTO);
  }

  async findCustomerByCpf(cpf: CPF): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerByCpf(
      cpf.toString(),
    );

    if (!customerDataSourceDTO) return { error: undefined, value: null };

    return CustomerMapper.toEntity(customerDataSourceDTO);
  }

  async findCustomerByEmail(
    email: Email,
  ): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerByEmail(
      email.toString(),
    );

    if (!customerDataSourceDTO) return { error: undefined, value: null };

    return CustomerMapper.toEntity(customerDataSourceDTO);
  }

  async findAllCustomers(
    params: FindAllCustomersInputDTO,
  ): Promise<CoreResponse<PaginatedResponse<Customer>>> {
    const paginatedParams: PaginatedDataSourceParamsDTO = {
      page: params.page ?? 1,
      limit: params.size ?? 10,
    };

    const filters: FindAllCustomersDataSourceFiltersDTO = {
      cpf: params.cpf,
      name: params.name,
      email: params.email,
    };

    const paginatedResponse = await this.dataSource.findAllCustomers(
      paginatedParams,
      filters,
    );

    const customers: Customer[] = [];
    paginatedResponse.data.forEach((customerDTO) => {
      const customerEntityResult = CustomerMapper.toEntity(customerDTO);

      if (customerEntityResult.error) {
        return { error: customerEntityResult.error, value: undefined };
      }

      customers.push(customerEntityResult.value);
    });

    const response: PaginatedResponse<Customer> = {
      data: customers,
      total: paginatedResponse.total,
      page: paginatedResponse.page,
      limit: paginatedResponse.limit,
      totalPages: paginatedResponse.totalPages,
    };

    return { error: undefined, value: response };
  }

  async saveCustomer(customer: Customer): Promise<CoreResponse<undefined>> {
    const dto = CustomerMapper.toDTO(customer);
    await this.dataSource.saveCustomer(dto);

    return { error: undefined, value: undefined };
  }
}
