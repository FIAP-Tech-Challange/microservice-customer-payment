import { NotificationChannelWhatsApp } from '../../../../../src/modules/notification/adapters/secondary/notification.channel.whatsapp';
import { BrazilianPhone } from '../../../../../src/shared/domain/brazilian-phone.vo';

describe('NotificationChannelWhatsApp', () => {
  let channel: NotificationChannelWhatsApp;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    channel = new NotificationChannelWhatsApp();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should send WhatsApp notification successfully', async () => {
    const phone = new BrazilianPhone('11999999999');
    const message = 'Test WhatsApp message';

    const result = await channel.sendNotification(phone, message);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending WhatsApp message to ${phone.toString()}. Message: ${message}`,
    );
    expect(result).toEqual({ success: true });
  });
});
