import { CreatePaymentDto } from '../../models/dto/create-payment.dto';
import { PaymentModel } from '../../models/domain/payment.model';
import { PaymentIdDto } from '../../models/dto/payment-id.dto';
import { UpdateStatusPaymentDto } from '../../models/dto/update-status-payment.dto';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';

export interface PaymentInputPort {
  create(createPaymentDto: CreatePaymentDto): Promise<PaymentModel | null>;
  findById(id: PaymentIdDto): Promise<PaymentModel>;
  updateStatus(
    id: string,
    status: UpdateStatusPaymentDto,
    req: RequestFromStore,
  ): Promise<PaymentModel | null>;
}
