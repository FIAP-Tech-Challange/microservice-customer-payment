import { PaymentDataSourceDTO } from 'src/common/dataSource/DTOs/paymentDataSource.dto';
import { Payment } from '../entities/payment.entity';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';
import { PaymentExternalDataSourceDTO } from 'src/common/dataSource/DTOs/paymentExternalDataSource.dto';
import { PaymentStatusEnum } from '../enums/paymentStatus.enum';
import { PaymentTypeEnum } from '../enums/paymentType.enum';
import { PaymentPlatformEnum } from '../enums/paymentPlatform.enum';
import { paymentTypeMap } from '../enums/paymentTypeMapper';

export class PaymentMapper {
  static toPersistenceDTO(entity: Payment): CoreResponse<PaymentDataSourceDTO> {
    if (!entity.externalId || !entity.platform) {
      return {
        error: new UnexpectedError(
          'Payment must be associated with an external source to be parsed to DataSourceDTO',
        ),
        value: undefined,
      };
    }

    const dto: PaymentDataSourceDTO = {
      id: entity.id,
      order_id: entity.orderId,
      store_id: entity.storeId,
      payment_type: entity.paymentType,
      status: entity.status,
      total: entity.total,
      external_id: entity.externalId,
      qr_code: entity.qrCode,
      created_at: entity.createdAt.toISOString(),
      platform: entity.platform,
    };

    return { error: undefined, value: dto };
  }

  static toExternalDTO(entity: Payment): PaymentExternalDataSourceDTO {
    return {
      id: entity.id,
      external_id: entity.externalId,
      total: entity.total,
      payment_type: paymentTypeMap[entity.paymentType],
    };
  }

  static toEntity(dto: PaymentDataSourceDTO): CoreResponse<Payment> {
    return Payment.restore({
      id: dto.id,
      orderId: dto.order_id,
      storeId: dto.store_id,
      total: dto.total,
      externalId: dto.external_id,
      qrCode: dto.qr_code,
      platform: dto.platform as PaymentPlatformEnum,
      createdAt: new Date(dto.created_at),
      paymentType: dto.payment_type as PaymentTypeEnum,
      status: dto.status as PaymentStatusEnum,
    });
  }
}
