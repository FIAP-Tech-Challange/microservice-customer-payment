import { PaymentPlataformEnum } from './../enum/payment-plataform.enum';
import { PaymentStatusEnum } from './../enum/payment-status.enum';
import { PaymentTypeEnum } from './../enum/payment-type.enum';

interface PaymentProps {
  id: string;
  orderId: string;
  storeId: string;
  paymentType: PaymentTypeEnum;
  status: PaymentStatusEnum;
  total: number;
  externalId: string;
  qrCode: string;
  plataform: PaymentPlataformEnum;
  createdAt: Date;
}
export class PaymentModel {
  id: string;
  orderId: string;
  storeId: string;
  paymentType: string;
  status: string;
  total: number;
  externalId: string;
  qrCode: string;
  plataform: string;
  createdAt: Date;

  private constructor(props: PaymentProps) {
    this.id = props.id;
    this.orderId = props.orderId;
    this.storeId = props.storeId;
    this.paymentType = props.paymentType;
    this.status = props.status;
    this.total = props.total;
    this.externalId = props.externalId;
    this.qrCode = props.qrCode;
    this.plataform = props.plataform;
    this.createdAt = props.createdAt;
  }

  private validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.orderId) {
      throw new Error('Order ID is required');
    }
    if (!this.storeId) {
      throw new Error('Store ID is required');
    }
    if (!this.paymentType) {
      throw new Error('Payment Type is required');
    }
    if (!this.status) {
      throw new Error('Status is required');
    }
    if (this.total <= 0) {
      throw new Error('Total must be greater than 0');
    }
    if (!this.externalId) {
      throw new Error('Total must be greater than 0');
    }
    if (!this.qrCode) {
      throw new Error('QR Code is required');
    }
    if (!this.plataform) {
      throw new Error('Plataform is required');
    }
    if (!this.createdAt) {
      throw new Error('Plataform is required');
    }
  }

  static create(
    props: Omit<PaymentProps, 'id' | 'status' | 'createdAt'>,
  ): PaymentModel {
    const payment = new PaymentModel({
      ...props,
      id: crypto.randomUUID(),
      status: PaymentStatusEnum.PENDING,
      createdAt: new Date(),
    });
    payment.validate();
    return payment;
  }

  static fromProps(props: PaymentProps): PaymentModel {
    const model = new PaymentModel(props);
    model.validate();
    return model;
  }
}
