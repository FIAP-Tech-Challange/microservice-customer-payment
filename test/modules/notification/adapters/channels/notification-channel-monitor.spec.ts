import { NotificationChannelMonitor } from '../../../../../src/modules/notification/adapters/secondary/notification.channel.monitor';

describe('NotificationChannelMonitor', () => {
  let channel: NotificationChannelMonitor;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    channel = new NotificationChannelMonitor();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should send monitor notification successfully', async () => {
    const monitorId = 'monitor-123';
    const message = 'Test monitor message';

    const result = await channel.sendNotification(monitorId, message);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending monitor notification to ${monitorId}. Message: ${message}`,
    );
    expect(result).toEqual({ success: true });
  });
});
