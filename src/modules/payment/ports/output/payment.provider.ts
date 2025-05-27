import { createQrCodeDto } from '../../models/dto/create-qr-code.dto';
import { ResponseQrCodeDto } from '../../models/dto/response-qr-code.dto';
import { PaymentPlataformEnum } from '../../models/enum/payment-plataform.enum';
import { PaymentTypeEnum } from '../../models/enum/payment-type.enum';
import { ResponseTotemDto } from '../../models/dto/response-totem.dto';

export interface PaymentProviderPort {
  readonly platformName: PaymentPlataformEnum;
  readonly paymentType: PaymentTypeEnum;

  createQrCode(dto: createQrCodeDto): Promise<ResponseQrCodeDto>;
  findTotemById(id: string): Promise<ResponseTotemDto>;
}
