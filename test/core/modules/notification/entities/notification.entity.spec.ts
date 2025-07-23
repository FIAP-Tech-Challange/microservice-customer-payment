import { Notification } from 'src-clean/core/modules/notification/entities/notification.entity';
import {
  NotificationStatus,
  NotificationChannel,
} from 'src-clean/core/modules/notification/entities/notification.enums';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';

describe('Notification Entity Tests', () => {
  describe('Notification Creation', () => {
    it('should create a notification with email channel', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test email notification',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.channel).toBe(NotificationChannel.EMAIL);
      expect(notification!.destinationToken).toBe(email);
      expect(notification!.message).toBe('Test email notification');
      expect(notification!.status).toBe(NotificationStatus.PENDING);
      expect(notification!.id).toBeDefined();
      expect(notification!.createdAt).toBeDefined();
      expect(notification!.updatedAt).toBeDefined();
      expect(notification!.sentAt).toBeUndefined();
      expect(notification!.errorMessage).toBeUndefined();
    });

    it('should create a notification with WhatsApp channel', () => {
      const { error: phoneError, value: phone } =
        BrazilianPhone.create('11987654321');
      expect(phoneError).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.WHATSAPP,
        destinationToken: phone!,
        message: 'Test WhatsApp notification',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.channel).toBe(NotificationChannel.WHATSAPP);
      expect(notification!.destinationToken).toBe(phone);
      expect(notification!.message).toBe('Test WhatsApp notification');
      expect(notification!.status).toBe(NotificationStatus.PENDING);
    });

    it('should create a notification with monitor channel and string token', () => {
      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.MONITOR,
        destinationToken: 'monitor-display-001',
        message: 'Test monitor notification',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.channel).toBe(NotificationChannel.MONITOR);
      expect(notification!.destinationToken).toBe('monitor-display-001');
      expect(notification!.message).toBe('Test monitor notification');
      expect(notification!.status).toBe(NotificationStatus.PENDING);
    });

    it('should fail to create notification with empty message', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: '',
      });

      expect(error).toBeDefined();
      expect(notification).toBeUndefined();
      expect(error?.message).toContain('message');
    });

    it('should fail to create notification with message containing only whitespace', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: '   ',
      });

      expect(error).toBeDefined();
      expect(notification).toBeUndefined();
      expect(error?.message).toContain('message');
    });

    it('should fail to create notification with message too long', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const longMessage = 'a'.repeat(1001); // Exceeds 1000 character limit

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: longMessage,
      });

      expect(error).toBeDefined();
      expect(notification).toBeUndefined();
      expect(error?.message).toContain('1000 characters');
    });

    it('should trim notification message when creating', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: '  Test message with spaces  ',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.message).toBe('Test message with spaces');
    });
  });

  describe('Notification Restoration', () => {
    it('should restore a notification from valid data', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const now = new Date();
      const sentAt = new Date(now.getTime() - 1000);

      const { error, value: notification } = Notification.restore({
        id: 'test-notification-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test notification',
        status: NotificationStatus.SENT,
        sentAt: sentAt,
        createdAt: now,
        updatedAt: now,
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.id).toBe('test-notification-id');
      expect(notification!.status).toBe(NotificationStatus.SENT);
      expect(notification!.sentAt).toBe(sentAt);
    });

    it('should fail to restore notification with invalid data', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error, value: notification } = Notification.restore({
        id: '', // Invalid empty ID
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test notification',
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(error).toBeDefined();
      expect(notification).toBeUndefined();
    });
  });

  describe('Notification Status Updates', () => {
    it('should mark notification as sent', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error: createError, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test notification',
      });

      expect(createError).toBeUndefined();
      expect(notification).toBeDefined();

      const { error, value: sentNotification } = notification!.markAsSent();

      expect(error).toBeUndefined();
      expect(sentNotification).toBeDefined();
      expect(sentNotification!.status).toBe(NotificationStatus.SENT);
      expect(sentNotification!.sentAt).toBeDefined();
      expect(sentNotification!.errorMessage).toBeUndefined();
    });

    it('should mark notification as failed with error message', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error: createError, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test notification',
      });

      expect(createError).toBeUndefined();
      expect(notification).toBeDefined();

      const errorMessage = 'Failed to send email: SMTP error';
      const { error, value: failedNotification } =
        notification!.markAsFailed(errorMessage);

      expect(error).toBeUndefined();
      expect(failedNotification).toBeDefined();
      expect(failedNotification!.status).toBe(NotificationStatus.FAILED);
      expect(failedNotification!.errorMessage).toBe(errorMessage);
      expect(failedNotification!.sentAt).toBeUndefined();
    });

    it('should fail to mark as failed without error message', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error: createError, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test notification',
      });

      expect(createError).toBeUndefined();
      expect(notification).toBeDefined();

      const { error, value: failedNotification } =
        notification!.markAsFailed('');

      expect(error).toBeDefined();
      expect(failedNotification).toBeUndefined();
      expect(error?.message).toContain('Error message is required');
    });
  });

  describe('Notification Getters', () => {
    it('should return correct property values', () => {
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      expect(emailError).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: email!,
        message: 'Test notification',
      });

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();

      expect(notification!.id).toBeDefined();
      expect(typeof notification!.id).toBe('string');
      expect(notification!.channel).toBe(NotificationChannel.EMAIL);
      expect(notification!.destinationToken).toBe(email);
      expect(notification!.message).toBe('Test notification');
      expect(notification!.status).toBe(NotificationStatus.PENDING);
      expect(notification!.createdAt).toBeInstanceOf(Date);
      expect(notification!.updatedAt).toBeInstanceOf(Date);
      expect(notification!.sentAt).toBeUndefined();
      expect(notification!.errorMessage).toBeUndefined();
    });
  });
});
