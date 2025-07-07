import { Customer } from '../entities/customer.entity';
import { CustomerPaginationDTO } from '../DTOs/customerPagination.dto';

export class CustomerPresenter {
  static toResponse(customer: Customer): CustomerResponseDTO {
    return {
      id: customer.id,
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  static toListResponse(customers: Customer[]): CustomerListResponseDTO {
    return {
      customers: customers.map(customer => this.toResponse(customer)),
    };
  }

  static toPaginationResponse(pagination: CustomerPaginationDTO): CustomerPaginationResponseDTO {
    return {
      data: pagination.customers.map(customer => ({
        id: customer.id,
        cpf: customer.cpf,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      })),
      pagination: {
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
      },
    };
  }
}

export interface CustomerResponseDTO {
  id: string;
  cpf: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerListResponseDTO {
  customers: CustomerResponseDTO[];
}

export interface CustomerPaginationResponseDTO {
  data: CustomerResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
