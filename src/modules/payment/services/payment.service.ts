import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaymentRepositoryPort } from '../ports/output/payment.repository';
import { PaymentModel } from '../models/domain/payment.model';
import { CreatePaymentDto } from '../models/dto/create-payment.dto';
import { PaymentStatusEnum } from '../models/enum/payment-status.enum';
import { PaymentProviderPort } from '../ports/output/payment.provider';
import {
  PAYMENT_PROVIDER_PORT,
  PAYMENT_REPOSITORY_PORT,
} from '../payment.tokens';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT)
    private readonly paymentRepositoryPort: PaymentRepositoryPort,
    @Inject(PAYMENT_PROVIDER_PORT)
    private readonly paymentProviderPort: PaymentProviderPort,
    private readonly configService: ConfigService,
  ) {}

  async savePayment(createPaymentDto: CreatePaymentDto): Promise<PaymentModel> {
    this.logger.log(`Creating payment for order ${createPaymentDto.orderId}`);

    const { qrCode, id } = await this.paymentProviderPort.createQrCode({
      orderId: createPaymentDto.orderId,
      total: createPaymentDto.total,
      title: `order_${createPaymentDto.orderId}`,
    });

    if (!qrCode || !id) {
      throw new BadRequestException('Error creating QR code for payment');
    }

    this.logger.log(`Create QrCode successfully, id: ${id}`);

    const payment = PaymentModel.create({
      orderId: createPaymentDto.orderId,
      storeId: createPaymentDto.storeId,
      paymentType: this.paymentProviderPort.paymentType,
      total: createPaymentDto.total,
      externalId: id,
      qrCode: qrCode,
      plataform: this.paymentProviderPort.platformName,
    });

    this.logger.log(
      `Saving payment for order in repository ${createPaymentDto.orderId}`,
    );

    if (this.configService.get('fakePaymentProvider') === 'S') {
      this.logger.warn(
        `Fake payment provider enabled, save for order ${createPaymentDto.orderId}`,
      );
      const paymentFake = await this.paymentRepositoryPort.savePayment(payment);
      return this.paymentRepositoryPort.updateStatus(
        paymentFake.id,
        PaymentStatusEnum.APPROVED,
      );
    }

    return this.paymentRepositoryPort.savePayment(payment);
  }

  async findById(id: string): Promise<PaymentModel> {
    this.logger.log(`Finding payment by id ${id}`);
    return this.paymentRepositoryPort.findById(id);
  }

  async updateStatus(
    id: string,
    status: PaymentStatusEnum,
  ): Promise<PaymentModel> {
    const statusKey = Object.entries(PaymentStatusEnum).find(
      ([, value]) => value === status,
    )?.[0];

    this.logger.log(`Updating payment status for id ${id} to ${statusKey}`);
    return this.paymentRepositoryPort.updateStatus(id, status);
  }
}
