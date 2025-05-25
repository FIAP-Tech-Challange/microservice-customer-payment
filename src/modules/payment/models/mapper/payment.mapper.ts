import { PaymentEntity } from '../entities/payment.entity';
import { PaymentPlataformEnum } from '../enum/payment-plataform.enum';
import { PaymentStatusEnum } from '../enum/payment-status.enum';
import { PaymentTypeEnum } from '../enum/payment-type.enum';
import { PaymentModel } from '../domain/payment.model';
import { PaymentResponseDto } from '../dto/payment.dto';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): PaymentModel {
    return PaymentModel.fromProps({
      id: entity.id,
      orderId: entity.order_id,
      storeId: entity.store_id,
      paymentType: entity.payment_type as PaymentTypeEnum,
      status: entity.status as PaymentStatusEnum,
      total: parseFloat(entity.total.toFixed(2)),
      externalId: entity.external_id,
      qrCode: entity.qr_code,
      plataform: entity.plataform as PaymentPlataformEnum,
      createdAt: entity.created_at,
    });
  }

  static toEntity(model: PaymentModel): PaymentEntity {
    const entity = new PaymentEntity();
    entity.id = model.id;
    entity.order_id = model.orderId;
    entity.store_id = model.storeId;
    entity.payment_type = model.paymentType;
    entity.status = model.status;
    entity.total = model.total;
    entity.external_id = model.externalId;
    entity.qr_code = model.qrCode;
    entity.plataform = model.plataform;
    entity.created_at = model.createdAt;
    return entity;
  }

  static toDto(model: PaymentModel): Partial<PaymentResponseDto> {
    return {
      id: model.id,
      orderId: model.orderId,
      storeId: model.storeId,
      paymentType: model.paymentType as PaymentTypeEnum,
      status: model.status as PaymentStatusEnum,
      total: model.total,
      externalId: model.externalId,
      qrCode: model.qrCode,
      plataform: model.plataform as PaymentPlataformEnum,
      createdAt: model.createdAt,
    };
  }
}
