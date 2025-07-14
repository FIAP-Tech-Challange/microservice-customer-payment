import { generateUUID } from 'src-clean/core/common/utils/uuid.helper';
import { PaymentStatusEnum } from './paymentStatus.enum';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CoreException } from 'src-clean/common/exceptions/coreException';
import { ResourceConflictException } from 'src-clean/common/exceptions/resourceConflictException';
import { PaymentPlatformDataSourceEnum } from 'src-clean/common/dataSource/enums/paymentPlatformDataSource.enum';
import { PaymentTypeDataSourceEnum } from 'src-clean/common/dataSource/enums/paymentTypeDataSource.enum';

interface PaymentProps {
  id: string;
  orderId: string;
  storeId: string;
  paymentType: PaymentTypeDataSourceEnum;
  status: PaymentStatusEnum;
  total: number;
  platform: PaymentPlatformDataSourceEnum | null;
  externalId: string | null;
  qrCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  private _id: string;
  private _orderId: string;
  private _storeId: string;
  private _paymentType: PaymentTypeDataSourceEnum;
  private _status: PaymentStatusEnum;
  private _total: number;
  private _externalId: string | null;
  private _qrCode: string | null;
  private _platform: PaymentPlatformDataSourceEnum | null;
  private _createdAt: Date;
  private _updatedAt: Date;

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
    this._updatedAt = props.updatedAt;

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
  get updatedAt() {
    return this._updatedAt;
  }

  associateExternal(
    externalId: string,
    platform: PaymentPlatformDataSourceEnum,
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
    this._updatedAt = new Date();

    if (qrCode && this._paymentType === PaymentTypeDataSourceEnum.QR) {
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
      throw new Error('ID is required');
    }
    if (!this._orderId) {
      throw new Error('Order ID is required');
    }
    if (!this._storeId) {
      throw new Error('Store ID is required');
    }
    if (!this._paymentType) {
      throw new Error('Payment Type is required');
    }
    if (!this._status) {
      throw new Error('Status is required');
    }
    if (this._total <= 0) {
      throw new Error('Total must be greater than 0');
    }
    if (!this._createdAt) {
      throw new Error('Created at is required');
    }
    if (!this._updatedAt) {
      throw new Error('Updated at is required');
    }
  }

  static create(
    props: Omit<
      PaymentProps,
      | 'id'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'externalId'
      | 'qrCode'
      | 'platform'
    >,
  ): CoreResponse<Payment> {
    const now = new Date();

    try {
      const payment = new Payment({
        id: generateUUID(),
        status: PaymentStatusEnum.PENDING,
        createdAt: now,
        updatedAt: now,
        externalId: null,
        qrCode: null,
        platform: null,
        ...props,
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
