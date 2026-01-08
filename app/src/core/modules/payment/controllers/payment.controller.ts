import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { InitiatePaymentInputDTO } from '../DTOs/initiatePaymentInput.dto';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { PaymentGateway } from '../gateways/payment.gateway';
import { OrderHttpGateway } from '../gateways/order.http.gateway';
import { InitiatePaymentUseCase } from '../useCases/initiatePayment.useCase';
import { PaymentPresenter } from '../presenters/payment.presenter';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';
import { ApprovePaymentUseCase } from '../useCases/approvePayment.useCase';
import { FindPaymentByIdUseCase } from '../useCases/findPaymentById.useCase';
import { CancelPaymentUseCase } from '../useCases/cancelPayment.useCase';
import { InitiatePaymentResponseDTO } from '../DTOs/initiatePaymentResponse.dto';
import { PaymentDTO } from '../DTOs/payment.dto';
import { ConfigService } from '@nestjs/config';
import { AwsParameterStoreService } from 'src/external/consumers/NestAPI/shared/services/parameter-store.service';
import { AwsSecretManagerService } from 'src/external/consumers/NestAPI/shared/services/secret-manager.service';
import { UnauthorizedException } from '@nestjs/common';

export class PaymentCoreController {
  private baseURL: string;
  private expectedApiKey: string;
  private configService: ConfigService;
  private secretManager: AwsSecretManagerService;
  private parameterStore: AwsParameterStoreService;
  private initialized = false;

  constructor(
    private dataSource: DataSource,
    configService?: ConfigService,
    secretManager?: AwsSecretManagerService,
    parameterStore?: AwsParameterStoreService,
  ) {
    this.configService = configService ?? new ConfigService();
    this.secretManager = secretManager ?? new AwsSecretManagerService();
    this.parameterStore = parameterStore ?? new AwsParameterStoreService();
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initConfigs();
      this.initialized = true;
    }
  }

  private async initConfigs() {
    const apiKeySecretName =
      this.configService.get<string>('apiKeyNameOrder') || '';

    if (!apiKeySecretName) {
      throw new UnauthorizedException('API key secret name is not configured');
    }

    this.expectedApiKey =
      await this.secretManager.getSecretValue(apiKeySecretName);

    if (!this.expectedApiKey) {
      throw new UnauthorizedException('API key not found in secret manager');
    }

    this.baseURL = await this.parameterStore.getParameter(
      this.configService.get<string>('orderServiceBaseUrlParam') || '',
    );

    if (!this.baseURL) {
      throw new UnauthorizedException(
        'Order service base URL not found in parameter store',
      );
    }
  }

  async initiatePayment(
    dto: InitiatePaymentInputDTO,
  ): Promise<CoreResponse<InitiatePaymentResponseDTO>> {
    try {
      await this.ensureInitialized();
      const paymentGateway = new PaymentGateway(this.dataSource);
      const orderGateway = new OrderHttpGateway(
        this.baseURL,
        this.expectedApiKey,
      );

      const initiatePaymentUseCase = new InitiatePaymentUseCase(paymentGateway);

      const order = await orderGateway.findById(dto.orderId);
      if (order.error || !order.value) {
        throw new Error('Order not found');
      }

      const initiatePayment = await initiatePaymentUseCase.execute({
        orderId: dto.orderId,
        storeId: dto.storeId,
        paymentType: dto.paymentType,
        totalPrice: order.value.totalPrice,
      });
      if (initiatePayment.error)
        return {
          error: initiatePayment.error,
          value: undefined,
        };

      await orderGateway.setToReceived(dto.orderId);

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
      await this.ensureInitialized();
      const paymentGateway = new PaymentGateway(this.dataSource);
      const orderGateway = new OrderHttpGateway(
        this.baseURL,
        this.expectedApiKey,
      );

      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentGateway);

      const approvePaymentUseCase = new ApprovePaymentUseCase(
        paymentGateway,
        findPaymentByIdUseCase,
      );

      const approvePayment = await approvePaymentUseCase.execute(paymentId);
      if (approvePayment.error)
        return {
          error: approvePayment.error,
          value: undefined,
        };

      await orderGateway.setToReceived(approvePayment.value.orderId);

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
      await this.ensureInitialized();
      const paymentGateway = new PaymentGateway(this.dataSource);
      const orderGateway = new OrderHttpGateway(
        this.baseURL,
        this.expectedApiKey,
      );

      const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentGateway);

      const cancelPaymentUseCase = new CancelPaymentUseCase(
        paymentGateway,
        findPaymentByIdUseCase,
      );

      const cancelPayment = await cancelPaymentUseCase.execute(paymentId);
      if (cancelPayment.error)
        return {
          error: cancelPayment.error,
          value: undefined,
        };

      await orderGateway.setToCanceled(cancelPayment.value.orderId);

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
      await this.ensureInitialized();
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
