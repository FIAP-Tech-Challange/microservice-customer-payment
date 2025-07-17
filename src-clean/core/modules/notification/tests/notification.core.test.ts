import {
  NotificationChannel,
  NotificationStatus,
} from '../entities/notification.enums';
import { Notification } from '../entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationDTO } from '../DTOs/notification.dto';

describe('Notification Core Tests', () => {
  describe('Notification Entity', () => {
    it('should create a notification with email channel', () => {
      const { error, value } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: 'test@example.com',
        message: 'Test notification',
      });

      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value!.channel).toBe(NotificationChannel.EMAIL);
      expect(value!.message).toBe('Test notification');
      expect(value!.status).toBe(NotificationStatus.PENDING);
    });

    it('should create a notification with WhatsApp channel', () => {
      const { error, value } = Notification.create({
        channel: NotificationChannel.WHATSAPP,
        destinationToken: '11999999999',
        message: 'Test WhatsApp notification',
      });

      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value!.channel).toBe(NotificationChannel.WHATSAPP);
      expect(value!.message).toBe('Test WhatsApp notification');
      expect(value!.status).toBe(NotificationStatus.PENDING);
    });

    it('should mark notification as sent', () => {
      const { value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: 'test@example.com',
        message: 'Test notification',
      });

      const { error, value: updatedNotification } = notification!.markAsSent();

      expect(error).toBeUndefined();
      expect(updatedNotification).toBeDefined();
      expect(updatedNotification!.status).toBe(NotificationStatus.SENT);
      expect(updatedNotification!.sentAt).toBeDefined();
    });

    it('should mark notification as failed', () => {
      const { value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: 'test@example.com',
        message: 'Test notification',
      });

      const { error, value: updatedNotification } = notification!.markAsFailed(
        'Email delivery failed',
      );

      expect(error).toBeUndefined();
      expect(updatedNotification).toBeDefined();
      expect(updatedNotification!.status).toBe(NotificationStatus.FAILED);
      expect(updatedNotification!.errorMessage).toBe('Email delivery failed');
    });
  });

  describe('Notification Mapper', () => {
    it('should map entity to DTO', () => {
      const { value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: 'test@example.com',
        message: 'Test notification',
      });

      const dto = NotificationMapper.toDTO(notification!);

      expect(dto.channel).toBe(NotificationChannel.EMAIL);
      expect(dto.destinationToken).toBe('test@example.com');
      expect(dto.message).toBe('Test notification');
      expect(dto.status).toBe(NotificationStatus.PENDING);
    });

    it('should map DTO to entity', () => {
      const dto: NotificationDTO = {
        id: '123',
        channel: NotificationChannel.EMAIL,
        destinationToken: 'test@example.com',
        message: 'Test notification',
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { error, value: notification } = NotificationMapper.toEntity(dto);

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.id).toBe('123');
      expect(notification!.channel).toBe(NotificationChannel.EMAIL);
      expect(notification!.destinationToken).toBe('test@example.com');
      expect(notification!.message).toBe('Test notification');
      expect(notification!.status).toBe(NotificationStatus.PENDING);
    });
  });
});
