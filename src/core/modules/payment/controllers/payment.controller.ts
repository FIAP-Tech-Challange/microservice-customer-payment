import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { InitiatePaymentInputDTO } from '../DTOs/initiatePaymentInput.dto';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { PaymentGateway } from '../gateways/payment.gateway';
import { InitiatePaymentUseCase } from '../useCases/initiatePayment.useCase';
import { FindStoreByIdUseCase } from '../../store/useCases/findStoreById.useCase';
import { StoreGateway } from '../../store/gateways/store.gateway';
import { PaymentPresenter } from '../presenters/payment.presenter';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';
import { ApprovePaymentUseCase } from '../useCases/approvePayment.useCase';
import { FindPaymentByIdUseCase } from '../useCases/findPaymentById.useCase';
import { CancelPaymentUseCase } from '../useCases/cancelPayment.useCase';
import { FindOrderByIdUseCase } from '../../order/useCases/findOrderById.useCase';
import { OrderGateway } from '../../order/gateways/order.gateway';
import { InitiatePaymentResponseDTO } from '../DTOs/initiatePaymentResponse.dto';
import { PaymentDTO } from '../DTOs/payment.dto';
import { SetOrderToCanceledUseCase } from '../../order/useCases/setOrderToCanceled.useCase';
import { SetOrderToReceivedUseCase } from '../../order/useCases/setOrderToReceived.useCase';
import { FindPaymentFromOrderUseCase } from '../useCases/findPaymentFromOrder.useCase';

export class PaymentCoreController {
  constructor(private dataSource: DataSource) {}

  async initiatePayment(
    dto: InitiatePaymentInputDTO,
  ): Promise<CoreResponse<InitiatePaymentResponseDTO>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const storeGateway = new StoreGateway(this.dataSource);
      const orderGateway = new OrderGateway(this.dataSource);

      const findOrderByIdUseCase = new FindOrderByIdUseCase(orderGateway);
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
        value: PaymentPresenter.toInitiatePaymentResponseDTO(
          initiatePayment.value,
        ),
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

  async approvePayment(paymentId: string): Promise<CoreResponse<void>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const orderGateway = new OrderGateway(this.dataSource);

      const findOrderUseCase = new FindOrderByIdUseCase(orderGateway);
      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentGateway);
      const findPaymentFromOrderUseCase = new FindPaymentFromOrderUseCase(
        paymentGateway,
        findOrderUseCase,
      );

      const approveOrderUseCase = new SetOrderToReceivedUseCase(
        orderGateway,
        findOrderUseCase,
        findPaymentFromOrderUseCase,
      );
      const approvePaymentUseCase = new ApprovePaymentUseCase(
        paymentGateway,
        findPaymentByIdUseCase,
        approveOrderUseCase,
      );

      const approvePayment = await approvePaymentUseCase.execute(paymentId);
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
      return {
        error: new UnexpectedError(
          `Something went wrong while approving payment, ${error.message}`,
        ),
        value: undefined,
      };
    }
  }

  async cancelPayment(paymentId: string): Promise<CoreResponse<void>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const orderGateway = new OrderGateway(this.dataSource);

      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentGateway);
      const findOrderUseCase = new FindOrderByIdUseCase(orderGateway);
      const cancelOrderUseCase = new SetOrderToCanceledUseCase(
        orderGateway,
        findOrderUseCase,
      );
      const cancelPaymentUseCase = new CancelPaymentUseCase(
        paymentGateway,
        findPaymentByIdUseCase,
        cancelOrderUseCase,
      );

      const cancelPayment = await cancelPaymentUseCase.execute(paymentId);
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
      return {
        error: new UnexpectedError(
          `Something went wrong while canceling payment, ${error.message}`,
        ),
        value: undefined,
      };
    }
  }

  async findPaymentById(paymentId: string): Promise<CoreResponse<PaymentDTO>> {
    try {
      const paymentGateway = new PaymentGateway(this.dataSource);
      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentGateway);

      const payment = await findPaymentByIdUseCase.execute(paymentId);
      if (payment.error)
        return {
          error: payment.error,
          value: undefined,
        };

      return {
        error: undefined,
        value: PaymentPresenter.toDto(payment.value),
      };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while finding payment by id, ${error.message}`,
        ),
        value: undefined,
      };
    }
  }
}
