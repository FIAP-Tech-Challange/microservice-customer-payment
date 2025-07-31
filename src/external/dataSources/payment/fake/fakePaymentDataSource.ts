import { PaymentCreateExternalDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentExternalDataSourceDTO } from 'src/common/dataSource/DTOs/paymentExternalDataSource.dto';
import { PaymentDataSource } from '../payment.dataSource';
import { PaymentPlatformDataSourceEnum } from 'src/common/dataSource/enums/paymentPlatformDataSource.enum';
import { PaymentTypeDataSourceEnum } from 'src/common/dataSource/enums/paymentTypeDataSource.enum';

export class FakePaymentDataSource implements PaymentDataSource {
  private payments: Map<string, PaymentExternalDataSourceDTO> = new Map();

  createPaymentExternal(
    paymentDTO: PaymentExternalDataSourceDTO,
  ): Promise<PaymentCreateExternalDataSourceResponseDTO> {
    const newExternalId = new Date().toISOString();

    this.payments.set(newExternalId, paymentDTO);
    if (
      !Object.values(PaymentTypeDataSourceEnum).includes(
        paymentDTO.payment_type,
      )
    ) {
      throw new Error('Payment type not found');
    }

    return Promise.resolve({
      externalId: newExternalId,
      paymentPlatform: PaymentPlatformDataSourceEnum.FK,
      qrCode:
        paymentDTO.payment_type === PaymentTypeDataSourceEnum.QR
          ? newExternalId
          : null,
    });
  }
}
