import { generateUUID } from 'src/core/common/utils/uuid.helper';
import { PaymentStatusEnum } from '../enums/paymentStatus.enum';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { PaymentTypeEnum } from '../enums/paymentType.enum';
import { PaymentPlatformEnum } from '../enums/paymentPlatform.enum';
import { isValidPaymentType } from 'src/core/common/utils/isValidPaymentType';
import { isValidPaymentStatus } from 'src/core/common/utils/isValidPaymentStatus';
import { isValidPaymentPlatform } from 'src/core/common/utils/isValidPaymentPlatform';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

interface PaymentProps {
  id: string;
  orderId: string;
  storeId: string;
  paymentType: PaymentTypeEnum;
  status: PaymentStatusEnum;
  total: number;
  platform: PaymentPlatformEnum | null;
  externalId: string | null;
  qrCode: string | null;
  createdAt: Date;
}

export class Payment {
  private _id: string;
  private _orderId: string;
  private _storeId: string;
  private _paymentType: PaymentTypeEnum;
  private _status: PaymentStatusEnum;
  private _total: number;
  private _externalId: string | null;
  private _qrCode: string | null;
  private _platform: PaymentPlatformEnum | null;
  private _createdAt: Date;

  private constructor(props: PaymentProps) {
    this._id = props.id;
    this._orderId = props.orderId;
    this._storeId = props.storeId;
    this._paymentType = props.paymentType;
    this._status = props.status;
    this._total = props.total;
    this._externalId = props.externalId;
    this._qrCode = props.qrCode;
    this._platform = props.platform;
    this._createdAt = props.createdAt;

    this.validate();
  }

  get id() {
    return this._id;
  }
  get orderId() {
    return this._orderId;
  }
  get storeId() {
    return this._storeId;
  }
  get paymentType() {
    return this._paymentType;
  }
  get status() {
    return this._status;
  }
  get total() {
    return this._total;
  }
  get externalId() {
    return this._externalId;
  }
  get qrCode() {
    return this._qrCode;
  }
  get platform() {
    return this._platform;
  }
  get createdAt() {
    return this._createdAt;
  }

  approve(): CoreResponse<undefined> {
    if (this._status !== PaymentStatusEnum.PENDING) {
      return {
        error: new ResourceConflictException(
          'Payment must be pending to be Approved',
        ),
        value: undefined,
      };
    }

    this._status = PaymentStatusEnum.APPROVED;

    try {
      this.validate();
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  reject(): CoreResponse<undefined> {
    if (this._status !== PaymentStatusEnum.PENDING) {
      return {
        error: new ResourceConflictException(
          'Payment must be pending to be Rejected',
        ),
        value: undefined,
      };
    }

    this._status = PaymentStatusEnum.REFUSED;

    try {
      this.validate();
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  associateExternal(
    externalId: string,
    platform: PaymentPlatformEnum,
    qrCode: string | null,
  ): CoreResponse<undefined> {
    if (this._externalId) {
      return {
        error: new ResourceConflictException(
          'Payment already associated with external source',
        ),
        value: undefined,
      };
    }

    this._externalId = externalId;
    this._platform = platform;

    if (qrCode && this._paymentType === PaymentTypeEnum.QR) {
      this._qrCode = qrCode;
    }

    try {
      this.validate();
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  private validate() {
    if (!this._id) {
      throw new ResourceInvalidException('ID is required');
    }
    if (!this._orderId) {
      throw new ResourceInvalidException('Order ID is required');
    }
    if (!this._storeId) {
      throw new ResourceInvalidException('Store ID is required');
    }
    if (!this._paymentType) {
      throw new ResourceInvalidException('Payment Type is required');
    } else if (!isValidPaymentType(this._paymentType)) {
      throw new ResourceInvalidException('Payment type is not valid');
    }
    if (!this._status) {
      throw new ResourceInvalidException('Status is required');
    } else if (!isValidPaymentStatus(this._status)) {
      throw new ResourceInvalidException('Status is not valid');
    }
    if (this._platform && !isValidPaymentPlatform(this._platform)) {
      throw new ResourceInvalidException('Payment is not valid');
    }
    if (this._total <= 0) {
      throw new ResourceInvalidException('Total must be greater than 0');
    }
    if (!this._createdAt) {
      throw new ResourceInvalidException('Created at is required');
    }
  }

  static create(props: {
    orderId: string;
    storeId: string;
    total: number;
    paymentType: PaymentTypeEnum;
  }): CoreResponse<Payment> {
    try {
      const payment = new Payment({
        id: generateUUID(),
        orderId: props.orderId,
        storeId: props.storeId,
        total: props.total,
        paymentType: props.paymentType,
        status: PaymentStatusEnum.PENDING,
        createdAt: new Date(),
        externalId: null,
        qrCode: null,
        platform: null,
      });
      return { error: undefined, value: payment };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static restore(props: PaymentProps): CoreResponse<Payment> {
    try {
      const entity = new Payment(props);
      return { error: undefined, value: entity };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }
}
