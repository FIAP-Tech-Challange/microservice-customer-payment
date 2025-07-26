import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { InitiatePaymentInputDTO } from '../DTOs/initiatePaymentInput.dto';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindStoreByIdUseCase } from '../../store/useCases/findStoreById.useCase';
import { FindOrderByIdUseCase } from '../../order/useCases/findOrderById.useCase';

export class InitiatePaymentUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private findOrderByIdUseCase: FindOrderByIdUseCase,
    private findStoreByIdUseCase: FindStoreByIdUseCase,
  ) {}

  async execute(dto: InitiatePaymentInputDTO): Promise<CoreResponse<Payment>> {
    const store = await this.findStoreByIdUseCase.execute(dto.storeId);
    if (store.error) return { error: store.error, value: undefined };

    const order = await this.findOrderByIdUseCase.execute(dto.orderId);
    if (order.error) return { error: order.error, value: undefined };

    const createPayment = Payment.create({
      orderId: order.value.id,
      total: order.value.totalPrice,
      storeId: store.value.id,
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
