import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { InitiatePaymentInputDTO } from '../DTOs/initiatePaymentInput.dto';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { PaymentGateway } from '../gateways/payment.gateway';
import { InitiatePaymentUseCase } from '../useCases/initiatePayment.useCase';
import { FindStoreByIdUseCase } from '../../store/useCases/findStoreById.useCase';
import { StoreGateway } from '../../store/gateways/store.gateway';
import { PaymentPresenter } from '../presenters/payment.presenter';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { PaymentDTO } from '../DTOs/payment.dto';
import { ApprovePaymentUseCase } from '../useCases/approvePayment.useCase';
import { FindPaymentByIdUseCase } from '../useCases/findPaymentById.useCase';
import { CancelPaymentUseCase } from '../useCases/cancelPayment.useCase';

export class PaymentController {
  constructor(private dataSource: DataSource) {}

  async initiatePayment(
    dto: InitiatePaymentInputDTO,
  ): Promise<CoreResponse<PaymentDTO>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const storeGateway = new StoreGateway(this.dataSource);

      const findOrderByIdUseCase: any = {};
      const findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
      const initiatePaymentUseCase = new InitiatePaymentUseCase(
        paymentGateway,
        findOrderByIdUseCase,
        findStoreByIdUseCase,
      );

      const initiatePayment = await initiatePaymentUseCase.execute(dto);
      if (initiatePayment.error)
        return {
          error: initiatePayment.error,
          value: undefined,
        };

      return {
        error: undefined,
        value: PaymentPresenter.toDto(initiatePayment.value),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while initiating payment',
        ),
        value: undefined,
      };
    }
  }

  async approvePayment(
    paymentId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const storeGateway = new StoreGateway(this.dataSource);

      const findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(
        paymentGateway,
        findStoreByIdUseCase,
      );
      const approvePaymentUseCase = new ApprovePaymentUseCase(
        paymentGateway,
        findPaymentByIdUseCase,
      );

      const approvePayment = await approvePaymentUseCase.execute(
        paymentId,
        storeId,
      );
      if (approvePayment.error)
        return {
          error: approvePayment.error,
          value: undefined,
        };

      return {
        error: undefined,
        value: undefined,
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while approving payment',
        ),
        value: undefined,
      };
    }
  }

  async cancelPayment(
    paymentId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const storeGateway = new StoreGateway(this.dataSource);

      const findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(
        paymentGateway,
        findStoreByIdUseCase,
      );
      const cancelPaymentUseCase = new CancelPaymentUseCase(
        paymentGateway,
        findPaymentByIdUseCase,
      );

      const cancelPayment = await cancelPaymentUseCase.execute(
        paymentId,
        storeId,
      );
      if (cancelPayment.error)
        return {
          error: cancelPayment.error,
          value: undefined,
        };

      return {
        error: undefined,
        value: undefined,
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while canceling payment',
        ),
        value: undefined,
      };
    }
  }
}
