import { PaginatedResponse } from 'src/core/common/DTOs/paginatedResponse.dto';
import { CustomerResponseDTO } from '../DTOs/customerResponse.dto';
import { Customer } from '../entities/customer.entity';
import { CustomerDTO } from '../DTOs/customer.dto';

export class CustomerPresenter {
  static toDTO(customer: Customer): CustomerResponseDTO {
    return {
      id: customer.id,
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
    };
  }

  static toPaginatedDTO(
    customerPaginated: PaginatedResponse<Customer>,
  ): PaginatedResponse<CustomerDTO> {
    return {
      page: customerPaginated.page,
      limit: customerPaginated.limit,
      total: customerPaginated.total,
      totalPages: customerPaginated.totalPages,
      data: customerPaginated.data.map((customer) =>
        CustomerPresenter.toDTO(customer),
      ),
    };
  }
}
