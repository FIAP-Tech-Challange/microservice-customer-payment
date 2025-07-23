import { CreateNotificationUseCase } from 'src-clean/core/modules/notification/useCases/createNotification.useCase';
import { NotificationGateway } from 'src-clean/core/modules/notification/gateways/notification.gateway';
import { Notification } from 'src-clean/core/modules/notification/entities/notification.entity';
import { NotificationChannel } from 'src-clean/core/modules/notification/entities/notification.enums';
import { CreateNotificationInputDTO } from 'src-clean/core/modules/notification/DTOs/notificationInput.dto';

describe('CreateNotificationUseCase', () => {
  let mockNotificationGateway: Partial<NotificationGateway>;
  let createNotificationUseCase: CreateNotificationUseCase;

  beforeEach(() => {
    mockNotificationGateway = {
      saveNotification: jest.fn(),
    };

    createNotificationUseCase = new CreateNotificationUseCase(
      mockNotificationGateway as NotificationGateway,
    );
  });

  it('should create email notification successfully', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'test@example.com',
      message: 'Test email notification',
    };

    (mockNotificationGateway.saveNotification as jest.Mock).mockImplementation(
      (notification: Notification) => ({
        error: undefined,
        value: notification,
      }),
    );

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.EMAIL);
    expect(result.value?.message).toBe('Test email notification');
    expect(mockNotificationGateway.saveNotification).toHaveBeenCalled();
  });

  it('should create WhatsApp notification successfully', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.WHATSAPP,
      destinationToken: '11987654321',
      message: 'Test WhatsApp notification',
    };

    (mockNotificationGateway.saveNotification as jest.Mock).mockImplementation(
      (notification: Notification) => ({
        error: undefined,
        value: notification,
      }),
    );

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.WHATSAPP);
    expect(result.value?.message).toBe('Test WhatsApp notification');
    expect(mockNotificationGateway.saveNotification).toHaveBeenCalled();
  });

  it('should create SMS notification successfully', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.SMS,
      destinationToken: '11987654321',
      message: 'Test SMS notification',
    };

    (mockNotificationGateway.saveNotification as jest.Mock).mockImplementation(
      (notification: Notification) => ({
        error: undefined,
        value: notification,
      }),
    );

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.SMS);
    expect(result.value?.message).toBe('Test SMS notification');
    expect(mockNotificationGateway.saveNotification).toHaveBeenCalled();
  });

  it('should create monitor notification successfully', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.MONITOR,
      destinationToken: 'monitor-display-001',
      message: 'Test monitor notification',
    };

    (mockNotificationGateway.saveNotification as jest.Mock).mockImplementation(
      (notification: Notification) => ({
        error: undefined,
        value: notification,
      }),
    );

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.channel).toBe(NotificationChannel.MONITOR);
    expect(result.value?.message).toBe('Test monitor notification');
    expect(mockNotificationGateway.saveNotification).toHaveBeenCalled();
  });

  it('should fail with invalid email address', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'invalid-email',
      message: 'Test notification',
    };

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.saveNotification).not.toHaveBeenCalled();
  });

  it('should fail with invalid phone number for WhatsApp', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.WHATSAPP,
      destinationToken: 'invalid-phone',
      message: 'Test notification',
    };

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.saveNotification).not.toHaveBeenCalled();
  });

  it('should fail with invalid phone number for SMS', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.SMS,
      destinationToken: 'invalid-phone',
      message: 'Test notification',
    };

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.saveNotification).not.toHaveBeenCalled();
  });

  it('should fail with empty message', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'test@example.com',
      message: '',
    };

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.saveNotification).not.toHaveBeenCalled();
  });

  it('should handle gateway save errors', async () => {
    const inputDto: CreateNotificationInputDTO = {
      channel: NotificationChannel.EMAIL,
      destinationToken: 'test@example.com',
      message: 'Test notification',
    };

    const saveError = new Error('Database save error');
    (mockNotificationGateway.saveNotification as jest.Mock).mockResolvedValue({
      error: saveError,
      value: undefined,
    });

    const result = await createNotificationUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Database save error');
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.saveNotification).toHaveBeenCalled();
  });
});
