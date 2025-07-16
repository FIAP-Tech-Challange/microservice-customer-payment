import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { Payment } from '../entities/payment.entity';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { PaymentMapper } from '../mappers/payment.mapper';
import { PaymentPlatformEnum } from '../enums/paymentPlatform.enum';

export class PaymentGateway {
  constructor(private dataSource: DataSource) {}

  async findPaymentById(
    paymentId: string,
  ): Promise<CoreResponse<Payment | null>> {
    const dto = await this.dataSource.findPaymentById(paymentId);
    if (!dto) return { error: undefined, value: null };

    const entity = PaymentMapper.toEntity(dto);
    if (entity.error) return { error: entity.error, value: undefined };

    return { error: undefined, value: entity.value };
  }

  async createOnExternal(payment: Payment): Promise<CoreResponse<Payment>> {
    const externalDTO = PaymentMapper.toExternalDTO(payment);

    const { externalId, paymentPlatform, qrCode } =
      await this.dataSource.createPaymentExternal(externalDTO);

    const platform = PaymentPlatformEnum[
      paymentPlatform
    ] as PaymentPlatformEnum;

    payment.associateExternal(externalId, platform, qrCode);

    return {
      error: undefined,
      value: payment,
    };
  }

  async rejectPaymentOnExternal(payment: Payment): Promise<CoreResponse<void>> {
    const dto = PaymentMapper.toExternalDTO(payment);
    await this.dataSource.rejectPaymentExternal(dto);
    return { error: undefined, value: undefined };
  }

  async approvePaymentExternal(payment: Payment): Promise<CoreResponse<void>> {
    const dto = PaymentMapper.toExternalDTO(payment);
    await this.dataSource.approvePaymentExternal(dto);
    return { error: undefined, value: undefined };
  }

  async save(payment: Payment): Promise<CoreResponse<void>> {
    const dto = PaymentMapper.toPersistenceDTO(payment);
    if (dto.error) return { error: dto.error, value: undefined };
    await this.dataSource.savePayment(dto.value);
    return { error: undefined, value: undefined };
  }
}
