import { NotificationChannelEmail } from '../../../../../src/modules/notification/adapters/secondary/notification.channel.email';
import { Email } from '../../../../../src/shared/domain/email.vo';

describe('NotificationChannelEmail', () => {
  let channel: NotificationChannelEmail;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    channel = new NotificationChannelEmail();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should send email notification successfully', async () => {
    const email = new Email('test@example.com');
    const message = 'Test email message';

    const result = await channel.sendNotification(email, message);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending email to ${email.toString()}. Message: ${message}`,
    );
    expect(result).toEqual({ success: true });
  });
});
