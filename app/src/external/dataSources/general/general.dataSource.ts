
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { PaymentDataSourceDTO } from 'src/common/dataSource/DTOs/paymentDataSource.dto';

export interface GeneralDataSource {

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
}
