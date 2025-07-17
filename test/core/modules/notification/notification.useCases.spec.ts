import { CreateNotificationUseCase } from 'src-clean/core/modules/notification/useCases/createNotification.useCase';
import { FindNotificationByIdUseCase } from 'src-clean/core/modules/notification/useCases/findNotificationById.useCase';
import { UpdateNotificationStatusUseCase } from 'src-clean/core/modules/notification/useCases/updateNotificationStatus.useCase';
import { FindNotificationsByStatusUseCase } from 'src-clean/core/modules/notification/useCases/findNotificationsByStatus.useCase';
import { FindAllNotificationsUseCase } from 'src-clean/core/modules/notification/useCases/findAllNotifications.useCase';
import { NotificationGateway } from 'src-clean/core/modules/notification/gateways/notification.gateway';
import { Notification } from 'src-clean/core/modules/notification/entities/notification.entity';
import {
  NotificationChannel,
  NotificationStatus,
} from 'src-clean/core/modules/notification/entities/notification.enums';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

describe('Notification Use Cases Tests', () => {
  let createNotificationUseCase: CreateNotificationUseCase;
  let findNotificationByIdUseCase: FindNotificationByIdUseCase;
  let updateNotificationStatusUseCase: UpdateNotificationStatusUseCase;
  let findNotificationsByStatusUseCase: FindNotificationsByStatusUseCase;
  let findAllNotificationsUseCase: FindAllNotificationsUseCase;
  let mockNotificationGateway: jest.Mocked<NotificationGateway>;

  beforeEach(() => {
    mockNotificationGateway = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      findByStatus: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<NotificationGateway>;

    createNotificationUseCase = new CreateNotificationUseCase(
      mockNotificationGateway,
    );
    findNotificationByIdUseCase = new FindNotificationByIdUseCase(
      mockNotificationGateway,
    );
    updateNotificationStatusUseCase = new UpdateNotificationStatusUseCase(
      mockNotificationGateway,
    );
    findNotificationsByStatusUseCase = new FindNotificationsByStatusUseCase(
      mockNotificationGateway,
    );
    findAllNotificationsUseCase = new FindAllNotificationsUseCase(
      mockNotificationGateway,
    );
  });

  describe('CreateNotificationUseCase', () => {
    it('should create a notification successfully', async () => {
      const { error, value: notification } = Notification.create({
        message: 'Test message',
        channel: NotificationChannel.EMAIL,
        recipient: 'test@example.com',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();

      (mockNotificationGateway.save as jest.Mock).mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      const result = await createNotificationUseCase.execute({
        message: 'Test message',
        channel: NotificationChannel.EMAIL,
        recipient: 'test@example.com',
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(mockNotificationGateway.save).toHaveBeenCalledWith(
        expect.any(Notification),
      );
    });
  });

  describe('FindNotificationByIdUseCase', () => {
    it('should find a notification by ID successfully', async () => {
      const { error, value: notification } = Notification.create({
        message: 'Test message',
        channel: NotificationChannel.EMAIL,
        recipient: 'test@example.com',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();

      (mockNotificationGateway.findById as jest.Mock).mockResolvedValue({
        error: undefined,
        value: notification,
      });

      const result = await findNotificationByIdUseCase.execute('test-id');

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.message).toBe('Test message');
      expect(mockNotificationGateway.findById).toHaveBeenCalledWith('test-id');
    });

    it('should return error when notification not found', async () => {
      (mockNotificationGateway.findById as jest.Mock).mockResolvedValue({
        error: undefined,
        value: null,
      });

      const result =
        await findNotificationByIdUseCase.execute('non-existent-id');

      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.value).toBeUndefined();
    });
  });

  describe('UpdateNotificationStatusUseCase', () => {
    it('should update notification status successfully', async () => {
      const { error, value: notification } = Notification.create({
        message: 'Test message',
        channel: NotificationChannel.EMAIL,
        recipient: 'test@example.com',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();

      (mockNotificationGateway.findById as jest.Mock).mockResolvedValue({
        error: undefined,
        value: notification,
      });

      (mockNotificationGateway.updateStatus as jest.Mock).mockResolvedValue({
        error: undefined,
        value: undefined,
      });

      const result = await updateNotificationStatusUseCase.execute({
        id: 'test-id',
        status: NotificationStatus.SENT,
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.status).toBe(NotificationStatus.SENT);
      expect(mockNotificationGateway.updateStatus).toHaveBeenCalledWith(
        expect.any(Notification),
      );
    });
  });

  describe('FindNotificationsByStatusUseCase', () => {
    it('should find notifications by status successfully', async () => {
      const { error, value: notification } = Notification.create({
        message: 'Test message',
        channel: NotificationChannel.EMAIL,
        recipient: 'test@example.com',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();

      (mockNotificationGateway.findByStatus as jest.Mock).mockResolvedValue({
        error: undefined,
        value: [notification],
      });

      const result = await findNotificationsByStatusUseCase.execute(
        NotificationStatus.PENDING,
      );

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.length).toBe(1);
      expect(result.value![0].message).toBe('Test message');
      expect(mockNotificationGateway.findByStatus).toHaveBeenCalledWith(
        NotificationStatus.PENDING,
      );
    });
  });

  describe('FindAllNotificationsUseCase', () => {
    it('should find all notifications successfully', async () => {
      const { error, value: notification } = Notification.create({
        message: 'Test message',
        channel: NotificationChannel.EMAIL,
        recipient: 'test@example.com',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();

      (mockNotificationGateway.findAll as jest.Mock).mockResolvedValue({
        error: undefined,
        value: [notification],
      });

      const result = await findAllNotificationsUseCase.execute();

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.length).toBe(1);
      expect(result.value![0].message).toBe('Test message');
      expect(mockNotificationGateway.findAll).toHaveBeenCalled();
    });
  });
});
