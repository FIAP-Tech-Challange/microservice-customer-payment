import { NotificationChannelFactory } from '../../../../src/modules/notification/adapters/secondary/notification.channel.factory';
import { NotificationChannelEmail } from '../../../../src/modules/notification/adapters/secondary/notification.channel.email';
import { NotificationChannelMonitor } from '../../../../src/modules/notification/adapters/secondary/notification.channel.monitor';
import { NotificationChannelSMS } from '../../../../src/modules/notification/adapters/secondary/notification.channel.sms';
import { NotificationChannelWhatsApp } from '../../../../src/modules/notification/adapters/secondary/notification.channel.whatsapp';
import {
  NotificationChannel,
  NotificationModel,
} from '../../../../src/modules/notification/models/domain/notification.model';

describe('NotificationChannelFactory', () => {
  it('should create email notification channel', () => {
    const mockNotification = {
      channel: NotificationChannel.EMAIL,
    } as NotificationModel;

    const channel = NotificationChannelFactory.create(mockNotification);

    expect(channel).toBeInstanceOf(NotificationChannelEmail);
  });

  it('should create WhatsApp notification channel', () => {
    const mockNotification = {
      channel: NotificationChannel.WHATSAPP,
    } as NotificationModel;

    const channel = NotificationChannelFactory.create(mockNotification);

    expect(channel).toBeInstanceOf(NotificationChannelWhatsApp);
  });

  it('should create SMS notification channel', () => {
    const mockNotification = {
      channel: NotificationChannel.SMS,
    } as NotificationModel;

    const channel = NotificationChannelFactory.create(mockNotification);

    expect(channel).toBeInstanceOf(NotificationChannelSMS);
  });

  it('should create Monitor notification channel', () => {
    const mockNotification = {
      channel: NotificationChannel.MONITOR,
    } as NotificationModel;

    const channel = NotificationChannelFactory.create(mockNotification);

    expect(channel).toBeInstanceOf(NotificationChannelMonitor);
  });

  it('should throw for unknown channel', () => {
    const mockNotification = {
      channel: 'UNKNOWN' as NotificationChannel,
    } as NotificationModel;

    expect(() => {
      NotificationChannelFactory.create(mockNotification);
    }).toThrow('Unknown channel');
  });
});
