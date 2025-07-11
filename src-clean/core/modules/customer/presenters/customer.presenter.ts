import { CustomerResponseDTO } from '../DTOs/customerResponse.dto';
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
}
