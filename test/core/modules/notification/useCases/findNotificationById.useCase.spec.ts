import { FindNotificationByIdUseCase } from 'src-clean/core/modules/notification/useCases/findNotificationById.useCase';
import { NotificationGateway } from 'src-clean/core/modules/notification/gateways/notification.gateway';
import { Notification } from 'src-clean/core/modules/notification/entities/notification.entity';
import {
  NotificationChannel,
  NotificationStatus,
} from 'src-clean/core/modules/notification/entities/notification.enums';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { FindNotificationByIdInputDTO } from 'src-clean/core/modules/notification/DTOs/notificationInput.dto';

describe('FindNotificationByIdUseCase', () => {
  let mockNotificationGateway: Partial<NotificationGateway>;
  let findNotificationByIdUseCase: FindNotificationByIdUseCase;

  beforeEach(() => {
    mockNotificationGateway = {
      findNotificationById: jest.fn(),
    };

    findNotificationByIdUseCase = new FindNotificationByIdUseCase(
      mockNotificationGateway as NotificationGateway,
    );
  });

  it('should find notification by id successfully', async () => {
    const notificationId = 'test-notification-id';
    const inputDto: FindNotificationByIdInputDTO = { id: notificationId };

    const { value: email } = Email.create('test@example.com');
    const { value: mockNotification } = Notification.create({
      channel: NotificationChannel.EMAIL,
      destinationToken: email!,
      message: 'Test notification',
    });

    (
      mockNotificationGateway.findNotificationById as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: mockNotification,
    });

    const result = await findNotificationByIdUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.message).toBe('Test notification');
    expect(result.value?.channel).toBe(NotificationChannel.EMAIL);
    expect(mockNotificationGateway.findNotificationById).toHaveBeenCalledWith(
      notificationId,
    );
  });

  it('should return error when notification is not found', async () => {
    const notificationId = 'non-existent-id';
    const inputDto: FindNotificationByIdInputDTO = { id: notificationId };

    (
      mockNotificationGateway.findNotificationById as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await findNotificationByIdUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toContain(
      `Notification with ID ${notificationId} not found`,
    );
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.findNotificationById).toHaveBeenCalledWith(
      notificationId,
    );
  });

  it('should handle gateway errors', async () => {
    const notificationId = 'test-notification-id';
    const inputDto: FindNotificationByIdInputDTO = { id: notificationId };
    const gatewayError = new Error('Database connection error');

    (
      mockNotificationGateway.findNotificationById as jest.Mock
    ).mockResolvedValue({
      error: gatewayError,
      value: undefined,
    });

    const result = await findNotificationByIdUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Database connection error');
    expect(result.value).toBeUndefined();
    expect(mockNotificationGateway.findNotificationById).toHaveBeenCalledWith(
      notificationId,
    );
  });

  it('should find notification with sent status', async () => {
    const notificationId = 'sent-notification-id';
    const inputDto: FindNotificationByIdInputDTO = { id: notificationId };

    const { value: email } = Email.create('test@example.com');
    const { value: notification } = Notification.create({
      channel: NotificationChannel.EMAIL,
      destinationToken: email!,
      message: 'Test notification',
    });

    const { value: sentNotification } = notification!.markAsSent();

    (
      mockNotificationGateway.findNotificationById as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: sentNotification,
    });

    const result = await findNotificationByIdUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.status).toBe(NotificationStatus.SENT);
    expect(result.value?.sentAt).toBeDefined();
    expect(mockNotificationGateway.findNotificationById).toHaveBeenCalledWith(
      notificationId,
    );
  });

  it('should find notification with failed status', async () => {
    const notificationId = 'failed-notification-id';
    const inputDto: FindNotificationByIdInputDTO = { id: notificationId };

    const { value: email } = Email.create('test@example.com');
    const { value: notification } = Notification.create({
      channel: NotificationChannel.EMAIL,
      destinationToken: email!,
      message: 'Test notification',
    });

    const errorMessage = 'SMTP connection failed';
    const { value: failedNotification } =
      notification!.markAsFailed(errorMessage);

    (
      mockNotificationGateway.findNotificationById as jest.Mock
    ).mockResolvedValue({
      error: undefined,
      value: failedNotification,
    });

    const result = await findNotificationByIdUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.status).toBe(NotificationStatus.FAILED);
    expect(result.value?.errorMessage).toBe(errorMessage);
    expect(result.value?.sentAt).toBeUndefined();
    expect(mockNotificationGateway.findNotificationById).toHaveBeenCalledWith(
      notificationId,
    );
  });
});
