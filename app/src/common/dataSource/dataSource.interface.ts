
import { CustomerDataSourceDTO } from './DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from './DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from './DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from './DTOs/paginatedDataSourceResponse.dto';
import { PaymentCreateExternalDataSourceResponseDTO } from './DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { PaymentExternalDataSourceDTO } from './DTOs/paymentExternalDataSource.dto';

export interface DataSource {

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null>;
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>>;
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void>;

  // Payment
  savePayment(paymentDTO: PaymentDataSourceDTO): Promise<void>;
  findPaymentById(paymentId: string): Promise<PaymentDataSourceDTO | null>;
  findPaymentByOrderId(orderId: string): Promise<PaymentDataSourceDTO | null>;
  createPaymentExternal(
    paymentDTO: PaymentExternalDataSourceDTO,
  ): Promise<PaymentCreateExternalDataSourceResponseDTO>;
}
