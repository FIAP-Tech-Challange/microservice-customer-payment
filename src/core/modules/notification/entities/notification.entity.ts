import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { NotificationStatus, NotificationChannel } from './notification.enums';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { generateUUID } from 'src/core/common/utils/uuid.helper';

export type NotificationDestinationToken = BrazilianPhone | Email | string;

interface NotificationProps {
  id: string;
  channel: NotificationChannel;
  destinationToken: NotificationDestinationToken;
  message: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Notification {
  private _id: string;
  private _channel: NotificationChannel;
  private _destinationToken: NotificationDestinationToken;
  private _message: string;
  private _status: NotificationStatus;
  private _errorMessage?: string;
  private _sentAt?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: NotificationProps) {
    this._id = props.id;
    this._channel = props.channel;
    this._destinationToken = props.destinationToken;
    this._message = props.message;
    this._status = props.status;
    this._errorMessage = props.errorMessage;
    this._sentAt = props.sentAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get channel(): NotificationChannel {
    return this._channel;
  }

  get destinationToken(): NotificationDestinationToken {
    return this._destinationToken;
  }

  get message(): string {
    return this._message;
  }

  get status(): NotificationStatus {
    return this._status;
  }

  get errorMessage(): string | undefined {
    return this._errorMessage;
  }

  get sentAt(): Date | undefined {
    return this._sentAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new ResourceInvalidException('Notification ID is required');
    }

    if (!this._channel) {
      throw new ResourceInvalidException('Notification channel is required');
    }

    if (!this._destinationToken) {
      throw new ResourceInvalidException(
        'Notification destination token is required',
      );
    }

    if (
      this._channel === NotificationChannel.EMAIL &&
      !(this._destinationToken instanceof Email)
    ) {
      throw new ResourceInvalidException(
        'Destination token must be an Email for EMAIL channel',
      );
    }

    if (
      (this._channel === NotificationChannel.WHATSAPP ||
        this._channel === NotificationChannel.SMS) &&
      !(this._destinationToken instanceof BrazilianPhone)
    ) {
      throw new ResourceInvalidException(
        'Destination token must be a BrazilianPhone for WHATSAPP or SMS channel',
      );
    }

    if (
      this._channel === NotificationChannel.MONITOR &&
      typeof this._destinationToken !== 'string'
    ) {
      throw new ResourceInvalidException(
        'Destination token must be a string for MONITOR channel',
      );
    }

    if (!this._message || this._message.trim() === '') {
      throw new ResourceInvalidException('Notification message is required');
    }

    if (this._message.trim().length > 1000) {
      throw new ResourceInvalidException(
        'Notification message must be less than 1000 characters',
      );
    }

    if (!this._status) {
      throw new ResourceInvalidException('Notification status is required');
    } else {
      if (this._status === NotificationStatus.FAILED && !this._errorMessage) {
        throw new ResourceInvalidException(
          'Notification errorMessage is required when status is FAILED',
        );
      }

      if (this._status === NotificationStatus.SENT && !this._sentAt) {
        throw new ResourceInvalidException(
          'Notification sentAt is required when status is SENT',
        );
      }
    }

    if (!this._createdAt) {
      throw new ResourceInvalidException('Notification createdAt is required');
    }

    if (!this._updatedAt) {
      throw new ResourceInvalidException('Notification updatedAt is required');
    }

    if (this._sentAt && this._status !== NotificationStatus.SENT) {
      throw new ResourceInvalidException(
        'Notification sentAt is only valid when status is SENT',
      );
    }

    if (this._errorMessage && this._status !== NotificationStatus.FAILED) {
      throw new ResourceInvalidException(
        'Notification errorMessage is only valid when status is FAILED',
      );
    }
  }

  public static create(props: {
    channel: NotificationChannel;
    destinationToken: NotificationDestinationToken;
    message: string;
  }): CoreResponse<Notification> {
    try {
      const notification = new Notification({
        id: generateUUID(),
        channel: props.channel,
        destinationToken: props.destinationToken,
        message: props.message.trim(),
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { value: notification, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }

  public static restore(props: NotificationProps): CoreResponse<Notification> {
    try {
      const notification = new Notification(props);
      return { value: notification, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }

  public markAsSent(): CoreResponse<void> {
    if (this._status !== NotificationStatus.PENDING) {
      return {
        error: new ResourceInvalidException(
          'Notification can only be marked as sent if it is pending',
        ),
        value: undefined,
      };
    }

    this._status = NotificationStatus.SENT;
    this._sentAt = new Date();
    this._updatedAt = new Date();

    return { value: undefined, error: undefined };
  }

  public markAsFailed(errorMessage: string): CoreResponse<void> {
    if (!errorMessage || errorMessage.trim() === '') {
      return {
        error: new ResourceInvalidException(
          'Error message is required when marking as failed',
        ),
        value: undefined,
      };
    }

    if (this._status !== NotificationStatus.PENDING) {
      return {
        error: new ResourceInvalidException(
          'Notification can only be marked as failed if it is pending',
        ),
        value: undefined,
      };
    }

    this._status = NotificationStatus.FAILED;
    this._errorMessage = errorMessage.trim();
    this._updatedAt = new Date();
    return { value: undefined, error: undefined };
  }
}
