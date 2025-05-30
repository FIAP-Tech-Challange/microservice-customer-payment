import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
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
import { OrderService } from 'src/modules/order/services/order.service';
import { getStatusName } from '../util/status-payment.util';
import { OrderStatusEnum } from 'src/modules/order/models/enum/order-status.enum';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT)
    private readonly paymentRepositoryPort: PaymentRepositoryPort,
    @Inject(PAYMENT_PROVIDER_PORT)
    private readonly paymentProviderPort: PaymentProviderPort,
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
  ) {}

  async savePayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentModel | null> {
    this.logger.log(`Creating payment for order ${createPaymentDto.orderId}`);

    const order = await this.orderService.findById(
      createPaymentDto.orderId,
      createPaymentDto.storeId,
    );

    if (order.status !== OrderStatusEnum.PENDING) {
      this.logger.log(
        'Payment cannot be created for orders with a status other than PENDING ',
      );
      throw new BadRequestException(
        'Payment cannot be created for orders with a status other than PENDING ',
      );
    }

    const orderItems = order.orderItems?.map((item) => {
      return {
        id: item.id,
        title: 'order_item_' + item.id,
        quantity: item.quantity,
        price: item.unitPrice,
        totalPrice: item.subtotal,
      };
    });

    const { qrCode, id } = await this.paymentProviderPort.createQrCode({
      orderId: createPaymentDto.orderId,
      total: order.totalPrice,
      title: `order_${createPaymentDto.orderId}`,
      items: orderItems ?? [],
    });

    if (!qrCode || !id) {
      throw new BadRequestException('Error creating QR code for payment');
    }

    this.logger.log(`Create QrCode successfully, id: ${id}`);

    const payment = PaymentModel.create({
      orderId: createPaymentDto.orderId,
      storeId: createPaymentDto.storeId,
      paymentType: this.paymentProviderPort.paymentType,
      total: order.totalPrice,
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

      const order = await this.orderService.findById(
        payment.orderId,
        createPaymentDto.storeId,
      );

      const paymentFake = await this.paymentRepositoryPort.savePayment(payment);

      await this.orderService.updateStatus(
        order.id,
        OrderStatusEnum.RECEIVED,
        createPaymentDto.storeId,
      );

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
    storeId: string,
  ): Promise<PaymentModel | null> {
    this.logger.log(
      `Updating payment status for id ${id} to ${getStatusName(status)}`,
    );

    const payment = await this.paymentRepositoryPort.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment id ${id} not found`);
    }

    if (payment.status !== (PaymentStatusEnum.PENDING as string)) {
      throw new BadRequestException(
        `Payment ${id} has a status other than pending, cannot be updated`,
      );
    }

    if (status === PaymentStatusEnum.APPROVED) {
      const order = await this.orderService.findById(payment.orderId, storeId);
      if (!order) {
        throw new NotFoundException(
          'the order linked to the payment was not found.',
        );
      }

      await this.orderService.updateStatus(
        order.id,
        OrderStatusEnum.RECEIVED,
        storeId,
      );
    }
    return this.paymentRepositoryPort.updateStatus(id, status);
  }
}
