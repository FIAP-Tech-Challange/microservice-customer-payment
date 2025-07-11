import {
  CustomerListResponseDTO,
  CustomerResponseDTO,
} from '../DTOs/customerResponseDTO';
import { Customer } from '../entities/customer.entity';

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
      customers: customers.map((customer) => this.toResponse(customer)),
    };
  }
}
