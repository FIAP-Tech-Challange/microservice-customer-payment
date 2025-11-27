import { Notification } from 'src/core/modules/notification/entities/notification.entity';
import {
  NotificationStatus,
  NotificationChannel,
} from 'src/core/modules/notification/entities/notification.enums';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

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

    it('should create a notification with SMS channel and string token', () => {
      const phoneCreate = BrazilianPhone.create('5592987654321');
      expect(phoneCreate.error).toBeUndefined();

      const { error, value: notification } = Notification.create({
        channel: NotificationChannel.SMS,
        destinationToken: phoneCreate.value!,
        message: 'Test SMS notification',
      });

      console.log(notification, error);

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.channel).toBe(NotificationChannel.SMS);
      expect(notification!.destinationToken.toString()).toBe('5592987654321');
      expect(notification!.message).toBe('Test SMS notification');
      expect(notification!.status).toBe(NotificationStatus.PENDING);
    });

    it('should fail to create a email notification with anything other than email', () => {
      const phoneCreate = BrazilianPhone.create('5592987654321');
      expect(phoneCreate.error).toBeUndefined();

      const { error: phoneError } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: phoneCreate.value!,
        message: 'Test notification',
      });
      expect(phoneError).toBeInstanceOf(ResourceInvalidException);
      expect(phoneError?.message).toContain(
        'Destination token must be an Email for EMAIL channel',
      );

      const { error: stringError } = Notification.create({
        channel: NotificationChannel.EMAIL,
        destinationToken: 'plain string',
        message: 'Test notification',
      });

      expect(stringError).toBeInstanceOf(ResourceInvalidException);
      expect(stringError?.message).toContain(
        'Destination token must be an Email for EMAIL channel',
      );
    });

    it('should fail to create a WhatsApp notification with anything other than phone number', () => {
      const { error: stringError } = Notification.create({
        channel: NotificationChannel.WHATSAPP,
        destinationToken: 'invalid-phone',
        message: 'Test WhatsApp notification',
      });
      expect(stringError).toBeDefined();
      expect(stringError?.message).toContain(
        'Destination token must be a BrazilianPhone for WHATSAPP or SMS channel',
      );

      const emailCreate = Email.create('teste@example.com');
      expect(emailCreate.error).toBeUndefined();

      const { error: emailError } = Notification.create({
        channel: NotificationChannel.WHATSAPP,
        destinationToken: emailCreate.value!,
        message: 'Test WhatsApp notification',
      });
      expect(emailError).toBeInstanceOf(ResourceInvalidException);
      expect(emailError?.message).toContain(
        'Destination token must be a BrazilianPhone for WHATSAPP or SMS channel',
      );
    });

    it('should fail to create a sms notification with anything other than phone number', () => {
      const { error: stringError } = Notification.create({
        channel: NotificationChannel.SMS,
        destinationToken: 'test@example.com',
        message: 'Test SMS notification',
      });
      expect(stringError).toBeDefined();
      expect(stringError?.message).toContain(
        'Destination token must be a BrazilianPhone for WHATSAPP or SMS channel',
      );

      const emailCreate = Email.create('teste@email.com');
      expect(emailCreate.error).toBeUndefined();
      const { error: emailError } = Notification.create({
        channel: NotificationChannel.SMS,
        destinationToken: emailCreate.value!,
        message: 'Test SMS notification',
      });
      expect(emailError).toBeInstanceOf(ResourceInvalidException);
      expect(emailError?.message).toContain(
        'Destination token must be a BrazilianPhone for WHATSAPP or SMS channel',
      );
    });

    it('should fail to create a monitor notification with anything other than string', () => {
      const phoneCreate = BrazilianPhone.create('11987654321');
      expect(phoneCreate.error).toBeUndefined();
      const { error } = Notification.create({
        channel: NotificationChannel.MONITOR,
        destinationToken: phoneCreate.value!,
        message: 'Test monitor notification',
      });
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Destination token must be a string for MONITOR channel',
      );

      const emailCreate = Email.create('testew@email.com');
      expect(emailCreate.error).toBeUndefined();
      const { error: emailError } = Notification.create({
        channel: NotificationChannel.MONITOR,
        destinationToken: emailCreate.value!,
        message: 'Test monitor notification',
      });
      expect(emailError).toBeInstanceOf(ResourceInvalidException);
      expect(emailError?.message).toContain(
        'Destination token must be a string for MONITOR channel',
      );
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

    it('should always create a notification with PENDING status', () => {
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
      expect(notification!.status).toBe(NotificationStatus.PENDING);
      expect(notification!.createdAt).toBeDefined();
      expect(notification!.updatedAt).toBeDefined();
      expect(notification!.sentAt).toBeUndefined();
      expect(notification!.errorMessage).toBeUndefined();
    });
  });

  describe('Notification Restoration', () => {
    it('should not be able to restore a notification with sentAt if status is not SENT', () => {
      const emailCreate = Email.create('test@email.com');
      expect(emailCreate.error).toBeUndefined();

      const { error, value: notification } = Notification.restore({
        id: 'test-notification-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailCreate.value!,
        message: 'Test notification',
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        sentAt: new Date(), // sentAt should not be set for PENDING status
      });
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Notification sentAt is only valid when status is SENT',
      );
      expect(notification).toBeUndefined();

      const { error: failedError, value: failedNotification } =
        Notification.restore({
          id: 'test-notification-id-failed',
          channel: NotificationChannel.EMAIL,
          destinationToken: emailCreate.value!,
          message: 'Test notification',
          status: NotificationStatus.FAILED,
          createdAt: new Date(),
          updatedAt: new Date(),
          sentAt: new Date(),
          errorMessage: 'Failed to send',
        });
      expect(failedError).toBeInstanceOf(ResourceInvalidException);
      expect(failedError?.message).toContain(
        'Notification sentAt is only valid when status is SENT',
      );
      expect(failedNotification).toBeUndefined();
    });

    it('should not be able to restore a notification with errorMessage if status is not FAILED', () => {
      const emailCreate = Email.create('test@example.com');
      expect(emailCreate.error).toBeUndefined();

      const { error, value: notification } = Notification.restore({
        id: 'test-notification-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailCreate.value!,
        message: 'Test notification',
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        errorMessage: 'Failed to send',
      });
      expect(notification).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Notification errorMessage is only valid when status is FAILED',
      );

      const { error: sentError, value: sentNotification } =
        Notification.restore({
          id: 'test-notification-id-sent',
          channel: NotificationChannel.EMAIL,
          destinationToken: emailCreate.value!,
          message: 'Test notification',
          status: NotificationStatus.SENT,
          createdAt: new Date(),
          updatedAt: new Date(),
          sentAt: new Date(),
          errorMessage: 'Failed to send',
        });
      expect(sentError).toBeInstanceOf(ResourceInvalidException);
      expect(sentError?.message).toContain(
        'Notification errorMessage is only valid when status is FAILED',
      );
      expect(sentNotification).toBeUndefined();
    });

    it('should fail to restore a SENT notification without sentAt', () => {
      const emailCreate = Email.create('test@example.com');
      expect(emailCreate.error).toBeUndefined();

      const { error, value: notification } = Notification.restore({
        id: 'test-notification-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailCreate.value!,
        message: 'Test notification',
        status: NotificationStatus.SENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Notification sentAt is required when status is SENT',
      );
      expect(notification).toBeUndefined();
    });

    it('should fail to restore a FAILED notification without errorMessage', () => {
      const emailCreate = Email.create('test@example.com');
      expect(emailCreate.error).toBeUndefined();

      const { error, value: notification } = Notification.restore({
        id: 'test-notification-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailCreate.value!,
        message: 'Test notification',
        status: NotificationStatus.FAILED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Notification errorMessage is required when status is FAILED',
      );
      expect(notification).toBeUndefined();
    });

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

      const { error } = notification!.markAsSent();

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.status).toBe(NotificationStatus.SENT);
      expect(notification!.sentAt).toBeDefined();
      expect(notification!.errorMessage).toBeUndefined();
    });

    it('should fail to mark as sent if not pending', () => {
      const emailCreate = Email.create('test@example.com');
      expect(emailCreate.error).toBeUndefined();

      const { value: notificationSent } = Notification.restore({
        id: 'test-notification-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailCreate.value!,
        message: 'Test notification',
        status: NotificationStatus.SENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        sentAt: new Date(),
      });
      expect(notificationSent).toBeDefined();
      const { error: sentError } = notificationSent!.markAsSent();
      expect(sentError).toBeInstanceOf(ResourceInvalidException);
      expect(sentError?.message).toContain(
        'Notification can only be marked as sent if it is pending',
      );
      expect(notificationSent).toBeDefined();
      expect(notificationSent!.status).toBe(NotificationStatus.SENT);
      expect(notificationSent!.sentAt).toBeDefined();
      expect(notificationSent!.errorMessage).toBeUndefined();

      const { value: notificationFailed } = Notification.restore({
        id: 'test-notification-id-failed',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailCreate.value!,
        message: 'Test notification',
        status: NotificationStatus.FAILED,
        createdAt: new Date(),
        updatedAt: new Date(),
        errorMessage: 'Failed to send',
      });

      expect(notificationFailed).toBeDefined();
      const { error: failedError } = notificationFailed!.markAsSent();
      expect(failedError).toBeInstanceOf(ResourceInvalidException);
      expect(failedError?.message).toContain(
        'Notification can only be marked as sent if it is pending',
      );
      expect(notificationFailed!.status).toBe(NotificationStatus.FAILED);
      expect(notificationFailed!.sentAt).toBeUndefined();
      expect(notificationFailed!.errorMessage).toBe('Failed to send');
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
      const { error } = notification!.markAsFailed(errorMessage);

      expect(error).toBeUndefined();
      expect(notification).toBeDefined();
      expect(notification!.status).toBe(NotificationStatus.FAILED);
      expect(notification!.errorMessage).toBe(errorMessage);
      expect(notification!.sentAt).toBeUndefined();
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
