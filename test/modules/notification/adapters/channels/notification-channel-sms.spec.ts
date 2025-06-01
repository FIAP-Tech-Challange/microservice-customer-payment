import { NotificationChannelSMS } from '../../../../../src/modules/notification/adapters/secondary/notification.channel.sms';
import { BrazilianPhone } from '../../../../../src/shared/domain/brazilian-phone.vo';

describe('NotificationChannelSMS', () => {
  let channel: NotificationChannelSMS;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    channel = new NotificationChannelSMS();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should send SMS notification successfully', async () => {
    const phone = new BrazilianPhone('11999999999');
    const message = 'Test SMS message';

    const result = await channel.sendNotification(phone, message);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending SMS message to ${phone.toString()}. Message: ${message}`,
    );
    expect(result).toEqual({ success: true });
  });
});
