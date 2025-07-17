import { PaymentCreateExternalDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentExternalDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentExternalDataSource.dto';
import { PaymentDataSource } from '../payment.dataSource';
import { PaymentPlatformDataSourceEnum } from 'src-clean/common/dataSource/enums/paymentPlatformDataSource.enum';
import { PaymentTypeDataSourceEnum } from 'src-clean/common/dataSource/enums/paymentTypeDataSource.enum';

export class FakePaymentDataSource implements PaymentDataSource {
  private payments: Map<string, PaymentExternalDataSourceDTO> = new Map();

  createPaymentExternal(
    paymentDTO: PaymentExternalDataSourceDTO,
  ): Promise<PaymentCreateExternalDataSourceResponseDTO> {
    const newExternalId = new Date().toISOString();

    this.payments.set(newExternalId, paymentDTO);

    const paymentType: PaymentTypeDataSourceEnum = PaymentTypeDataSourceEnum[
      paymentDTO.payment_type
    ] as PaymentTypeDataSourceEnum;

    return Promise.resolve({
      externalId: newExternalId,
      paymentPlatform: PaymentPlatformDataSourceEnum.FK,
      qrCode:
        paymentType === PaymentTypeDataSourceEnum.QR ? newExternalId : null,
    });
  }
  rejectPaymentExternal(externalId: string): Promise<void> {
    if (!this.payments.has(externalId)) {
      throw new Error(`Payment with external ID ${externalId} not found.`);
    }

    this.payments.delete(externalId);
    return Promise.resolve();
  }
  approvePaymentExternal(externalId: string): Promise<void> {
    if (!this.payments.has(externalId)) {
      throw new Error(`Payment with external ID ${externalId} not found.`);
    }

    // Simulate approval logic
    return Promise.resolve();
  }
}
