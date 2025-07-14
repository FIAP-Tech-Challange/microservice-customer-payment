import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';
import { Payment } from '../entities/payment.entity';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { PaymentTypeEnum } from '../entities/paymentType.enum';
import { PaymentStatusEnum } from '../entities/paymentStatus.enum';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { PaymentPlatformDataSourceEnum } from 'src-clean/common/dataSource/enums/paymentPlatformDataSource.enum';
import { PaymentExternalDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentExternalDataSource.dto';

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
      updated_at: entity.updatedAt.toISOString(),
      platform: entity.platform,
    };

    return { error: undefined, value: dto };
  }

  static toExternalDTO(entity: Payment): PaymentExternalDataSourceDTO {
    return {
      id: entity.id,
      order_id: entity.orderId,
      store_id: entity.storeId,
      status: entity.status,
      total: entity.total,
      payment_type: entity.paymentType,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }

  static toEntity(dto: PaymentDataSourceDTO): CoreResponse<Payment> {
    const type: PaymentTypeEnum = PaymentTypeEnum[
      dto.payment_type
    ] as PaymentTypeEnum;

    const status: PaymentStatusEnum = PaymentStatusEnum[
      dto.status
    ] as PaymentStatusEnum;

    const platform: PaymentPlatformDataSourceEnum =
      PaymentPlatformDataSourceEnum[
        dto.platform
      ] as PaymentPlatformDataSourceEnum;

    return Payment.restore({
      id: dto.id,
      orderId: dto.order_id,
      storeId: dto.store_id,
      total: dto.total,
      externalId: dto.external_id,
      qrCode: dto.qr_code,
      platform: platform,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      paymentType: type,
      status: status,
    });
  }
}
