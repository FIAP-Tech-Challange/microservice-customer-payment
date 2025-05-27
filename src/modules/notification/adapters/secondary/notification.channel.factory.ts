import {
  NotificationChannel,
  NotificationModel,
} from '../../models/domain/notification.model';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';
import { NotificationChannelEmail } from './notification.channel.email';
import { NotificationChannelMonitor } from './notification.channel.monitor';
import { NotificationChannelSMS } from './notification.channel.sms';
import { NotificationChannelWhatsApp } from './notification.channel.whatsapp';

export class NotificationChannelFactory {
  static create(notification: NotificationModel): NotificationChannelPort {
    switch (notification.channel) {
      case NotificationChannel.WHATSAPP:
        return new NotificationChannelWhatsApp();
      case NotificationChannel.EMAIL:
        return new NotificationChannelEmail();
      case NotificationChannel.SMS:
        return new NotificationChannelSMS();
      case NotificationChannel.MONITOR:
        return new NotificationChannelMonitor();
      default:
        throw new Error('Unknown channel');
    }
  }
}
