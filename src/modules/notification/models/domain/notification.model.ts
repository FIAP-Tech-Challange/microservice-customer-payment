import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';
import { Email } from 'src/shared/domain/email.vo';

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  MONITOR = 'MONITOR',
}

interface NotificationProps {
  id: string;
  channel: NotificationChannel;
  destinationToken: NotificationDestinationToken;
  message: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export type NotificationDestinationToken = BrazilianPhone | Email | string;

export class NotificationModel {
  id: string;
  channel: NotificationChannel;
  destinationToken: NotificationDestinationToken;
  message: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt?: Date;

  private constructor(props: NotificationProps) {
    this.id = props.id;
    this.channel = props.channel;
    this.destinationToken = props.destinationToken;
    this.message = props.message;
    this.status = props.status;
    this.errorMessage = props.errorMessage || undefined;
    this.sentAt = props.sentAt || undefined;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt || undefined;

    this.validate();
  }

  validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.channel) {
      throw new Error('Channel is required');
    }
    switch (this.channel) {
      case NotificationChannel.WHATSAPP:
        if (!(this.destinationToken instanceof BrazilianPhone)) {
          throw new Error(
            'Destination token must be a valid Brazilian phone number for WhatsApp',
          );
        }
        break;
      case NotificationChannel.EMAIL:
        if (!(this.destinationToken instanceof Email)) {
          throw new Error(
            'Destination token must be a valid email for Email channel',
          );
        }
        break;
      case NotificationChannel.SMS:
        if (!(this.destinationToken instanceof BrazilianPhone)) {
          throw new Error(
            'Destination token must be a valid Brazilian phone number for SMS',
          );
        }
        break;
      case NotificationChannel.MONITOR:
        if (typeof this.destinationToken !== 'string') {
          throw new Error(
            'Destination token must be a string for Monitor channel',
          );
        }
        break;
      default:
        throw new Error('Invalid channel');
    }

    if (!this.message) {
      throw new Error('Message is required');
    }
    if (!this.status) {
      throw new Error('Status is required');
    }

    if (this.status === NotificationStatus.FAILED && !this.errorMessage) {
      throw new Error('Error message is required when status is FAILED');
    }
    if (this.status === NotificationStatus.SENT && !this.sentAt) {
      throw new Error('Sent at is required when status is SENT');
    }
    if (this.status === NotificationStatus.PENDING && this.sentAt) {
      throw new Error('Sent at should not be set when status is PENDING');
    }
    if (!this.createdAt) {
      throw new Error('Created at is required');
    }
  }

  setError(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.status = NotificationStatus.FAILED;
    this.updatedAt = new Date();
    this.validate();
  }

  setSent() {
    this.status = NotificationStatus.SENT;
    this.sentAt = new Date();
    this.updatedAt = new Date();
    this.validate();
  }

  static create(
    channel: NotificationChannel,
    destinationToken: NotificationDestinationToken,
    message: string,
  ) {
    return new NotificationModel({
      id: crypto.randomUUID(),
      channel,
      destinationToken,
      message,
      status: NotificationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: NotificationProps): NotificationModel {
    return new NotificationModel({
      id: props.id,
      channel: props.channel,
      destinationToken: props.destinationToken,
      message: props.message,
      status: props.status,
      errorMessage: props.errorMessage,
      sentAt: props.sentAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }
}
