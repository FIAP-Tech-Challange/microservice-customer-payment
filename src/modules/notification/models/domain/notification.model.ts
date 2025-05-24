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
  destinationToken: string;
  message: string;
  status: NotificationStatus;
  errorMessage: string | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class NotificationModel {
  id: string;
  channel: NotificationChannel;
  destinationToken: string;
  message: string;
  status: NotificationStatus;
  errorMessage: string;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;

  private constructor(props: NotificationProps) {
    this.id = props.id;
    this.channel = props.channel;
    this.destinationToken = props.destinationToken;
    this.message = props.message;
    this.status = props.status;
    this.errorMessage = props.errorMessage || '';
    this.sentAt = props.sentAt || null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt || null;

    this.validate();
  }

  validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.channel) {
      throw new Error('Channel is required');
    }

    // TODO
    switch (this.channel) {
      case NotificationChannel.WHATSAPP:
        // validate if it is a number
        break;
      case NotificationChannel.EMAIL:
        // validate if it is a valid email
        break;
      case NotificationChannel.SMS:
        // validate if it is a number
        break;
      case NotificationChannel.MONITOR:
        // validate if it is a monitor ID (maybe totem ID)
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
    destinationToken: string,
    message: string,
  ) {
    return new NotificationModel({
      id: crypto.randomUUID(),
      channel,
      destinationToken,
      message,
      status: NotificationStatus.PENDING,
      createdAt: new Date(),
      errorMessage: null,
      sentAt: null,
      updatedAt: null,
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
