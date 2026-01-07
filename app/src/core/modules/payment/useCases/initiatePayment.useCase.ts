import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { InitiatePaymentInputDTO } from '../DTOs/initiatePaymentInput.dto';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';


export class InitiatePaymentUseCase {
  constructor(
    private paymentGateway: PaymentGateway,

  ) {}

  async execute(dto: InitiatePaymentInputDTO): Promise<CoreResponse<Payment>> {

    const createPayment = Payment.create({
      orderId: dto.orderId,
      total: dto.totalPrice || 0,
      storeId: dto.storeId,
      paymentType: dto.paymentType,
    });

    if (createPayment.error) {
      return { error: createPayment.error, value: undefined };
    }

    const externalPayment = await this.paymentGateway.createOnExternal(
      createPayment.value,
    );

    if (externalPayment.error) {
      return { error: externalPayment.error, value: undefined };
    }

    const savePayment = await this.paymentGateway.save(externalPayment.value);
    if (savePayment.error) {
      return { error: savePayment.error, value: undefined };
    }

    return { error: undefined, value: externalPayment.value };
  }
}
