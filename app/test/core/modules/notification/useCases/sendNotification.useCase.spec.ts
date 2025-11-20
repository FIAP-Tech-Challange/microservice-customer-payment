import { SendNotificationUseCase } from 'src/core/modules/notification/useCases/sendNotification.useCase';
import { NotificationGateway } from 'src/core/modules/notification/gateways/notification.gateway';
import { Notification } from 'src/core/modules/notification/entities/notification.entity';
import { NotificationChannel } from 'src/core/modules/notification/entities/notification.enums';
import { SendNotificationInputDTO } from 'src/core/modules/notification/DTOs/notificationInput.dto';

describe('SendNotificationUseCase', () => {
  let mockNotificationGateway: Partial<NotificationGateway>;
  let sendNotificationUseCase: SendNotificationUseCase;

  beforeEach(() => {
    mockNotificationGateway = {
      sendNotification: jest.fn(),
    };

    sendNotificationUseCase = new SendNotificationUseCase(
      mockNotificationGateway as NotificationGateway,
    );

    (mockNotificationGateway.sendNotification as jest.Mock).mockImplementation(
      (notification: Notification) => {
        notification.markAsSent();
        return {
          error: undefined,
          value: notification,
        };
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create email notification successfully', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'test@example.com',
      message: 'Test email notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);
    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.EMAIL);
    expect(result.value?.message).toBe('Test email notification');
    expect(mockNotificationGateway.sendNotification).toHaveBeenCalled();
  });

  it('should create WhatsApp notification successfully', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.WHATSAPP,
      destinationToken: '11987654321',
      message: 'Test WhatsApp notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.WHATSAPP);
    expect(result.value?.message).toBe('Test WhatsApp notification');
    expect(mockNotificationGateway.sendNotification).toHaveBeenCalled();
  });

  it('should create SMS notification successfully', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.SMS,
      destinationToken: '11987654321',
      message: 'Test SMS notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.SMS);
    expect(result.value?.message).toBe('Test SMS notification');
    expect(mockNotificationGateway.sendNotification).toHaveBeenCalled();
  });

  it('should create monitor notification successfully', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.MONITOR,
      destinationToken: 'monitor-display-001',
      message: 'Test monitor notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.MONITOR);
    expect(result.value?.message).toBe('Test monitor notification');
    expect(mockNotificationGateway.sendNotification).toHaveBeenCalled();
  });

  it('should fail with invalid email address', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'invalid-email',
      message: 'Test notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.sendNotification).not.toHaveBeenCalled();
  });

  it('should fail with invalid phone number for WhatsApp', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.WHATSAPP,
      destinationToken: 'invalid-phone',
      message: 'Test notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.sendNotification).not.toHaveBeenCalled();
  });

  it('should fail with invalid phone number for SMS', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.SMS,
      destinationToken: 'invalid-phone',
      message: 'Test notification',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.sendNotification).not.toHaveBeenCalled();
  });

  it('should fail with empty message', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'test@example.com',
      message: '',
    };

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.sendNotification).not.toHaveBeenCalled();
  });

  it('should handle gateway save errors', async () => {
    const inputDto: SendNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'test@example.com',
      message: 'Test notification',
    };

    const saveError = new Error('Database save error');
    (mockNotificationGateway.sendNotification as jest.Mock).mockResolvedValue({
      error: saveError,
      value: undefined,
    });

    const result = await sendNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Database save error');
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.sendNotification).toHaveBeenCalled();
  });
});
