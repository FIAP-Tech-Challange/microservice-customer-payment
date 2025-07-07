import { CustomerDataSourceDTO, CustomerPaginationDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { CustomerDTO } from '../DTOs/customer.dto';
import { CustomerPaginationDTO } from '../DTOs/customerPagination.dto';

export class CustomerDataSourceMapper {
  static toCustomerDTO(dataSourceDTO: CustomerDataSourceDTO): CustomerDTO {
    return {
      id: dataSourceDTO.id,
      cpf: dataSourceDTO.cpf,
      name: dataSourceDTO.name,
      email: dataSourceDTO.email,
      createdAt: dataSourceDTO.createdAt,
      updatedAt: dataSourceDTO.updatedAt,
    };
  }

  static toCustomerDataSourceDTO(customerDTO: CustomerDTO): CustomerDataSourceDTO {
    return {
      id: customerDTO.id,
      cpf: customerDTO.cpf,
      name: customerDTO.name,
      email: customerDTO.email,
      createdAt: customerDTO.createdAt,
      updatedAt: customerDTO.updatedAt,
    };
  }

  static toCustomerPaginationDTO(dataSourceDTO: CustomerPaginationDataSourceDTO): CustomerPaginationDTO {
    return {
      customers: dataSourceDTO.customers.map(customer => this.toCustomerDTO(customer)),
      total: dataSourceDTO.total,
      page: dataSourceDTO.page,
      limit: dataSourceDTO.limit,
      totalPages: dataSourceDTO.totalPages,
    };
  }
}
