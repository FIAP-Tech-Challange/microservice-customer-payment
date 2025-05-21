import { Injectable } from '@nestjs/common';
import { PaymentProviderPort } from '../../ports/output/payment.provider';
import { PaymentTypeEnum } from '../../models/enum/payment-type.enum';
import { PaymentPlataformEnum } from '../../models/enum/payment-plataform.enum';
import { ResponseTotemDto } from '../../models/dto/response-totem.dto';
import { createQrCodeDto } from '../../models/dto/create-qr-code.dto';
import { ResponseQrCodeDto } from '../../models/dto/response-qr-code.dto';

@Injectable()
export class FakePaymentProvider implements PaymentProviderPort {
  readonly paymentType = PaymentTypeEnum.QR;
  readonly platformName = PaymentPlataformEnum.FK;

  createQrCode(dto: createQrCodeDto): Promise<ResponseQrCodeDto> {
    const uuid: string = crypto.randomUUID();
    const fakeQrCode: string = `00020101021226930014BR.GOV.BCB.PIX0136FAKE-MOCK-${uuid}5204000053039865802BR5913FAKE PROVIDER6009Sao Paulo62070503***6304`;
    return Promise.resolve({
      id: `FAKE_ID_${dto.orderId}`,
      qrCode: fakeQrCode,
    });
  }

  findTotemById(id: string): Promise<ResponseTotemDto> {
    throw new Error(`Method fake not implemented. ${id} searching..`);
  }
}
