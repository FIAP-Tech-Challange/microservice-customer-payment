import { PaymentCreateExternalDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentExternalDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentExternalDataSource.dto';

export interface PaymentDataSource {
  createPaymentExternal(
    paymentDTO: PaymentExternalDataSourceDTO,
  ): Promise<PaymentCreateExternalDataSourceResponseDTO>;
  rejectPaymentExternal(externalId: string): Promise<void>;
  approvePaymentExternal(externalId: string): Promise<void>;
}
