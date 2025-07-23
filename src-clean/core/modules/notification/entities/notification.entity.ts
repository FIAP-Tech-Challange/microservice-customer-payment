import { randomUUID } from 'node:crypto';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CoreException } from 'src-clean/common/exceptions/coreException';
import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';
import { NotificationStatus, NotificationChannel } from './notification.enums';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';

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
    }

    if (!this._createdAt) {
      throw new ResourceInvalidException('Notification createdAt is required');
    }

    if (!this._updatedAt) {
      throw new ResourceInvalidException('Notification updatedAt is required');
    }
  }

  public static create(props: {
    channel: NotificationChannel;
    destinationToken: NotificationDestinationToken;
    message: string;
  }): CoreResponse<Notification> {
    try {
      const notification = new Notification({
        id: randomUUID(),
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

  public markAsSent(): CoreResponse<Notification> {
    try {
      const updatedNotification = new Notification({
        id: this._id,
        channel: this._channel,
        destinationToken: this._destinationToken,
        message: this._message,
        status: NotificationStatus.SENT,
        errorMessage: undefined,
        sentAt: new Date(),
        createdAt: this._createdAt,
        updatedAt: new Date(),
      });

      return { value: updatedNotification, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }

  public markAsFailed(errorMessage: string): CoreResponse<Notification> {
    try {
      if (!errorMessage || errorMessage.trim() === '') {
        throw new ResourceInvalidException(
          'Error message is required when marking as failed',
        );
      }

      const updatedNotification = new Notification({
        id: this._id,
        channel: this._channel,
        destinationToken: this._destinationToken,
        message: this._message,
        status: NotificationStatus.FAILED,
        errorMessage: errorMessage.trim(),
        sentAt: undefined,
        createdAt: this._createdAt,
        updatedAt: new Date(),
      });

      return { value: updatedNotification, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }
}
