jest.mock('../../../../src/shared/domain/email.vo', () => {
  class MockEmail {
    private email: string;

    constructor(email: string) {
      this.email = email;
    }

    toString(): string {
      return this.email;
    }
  }
  return {
    Email: MockEmail,
  };
});

jest.mock('../../../../src/shared/domain/brazilian-phone.vo', () => {
  class MockBrazilianPhone {
    private phone: string;

    constructor(phone: string) {
      this.phone = phone;
    }

    toString(): string {
      return this.phone;
    }
  }
  return {
    BrazilianPhone: MockBrazilianPhone,
  };
});

import {
  NotificationChannel,
  NotificationModel,
  NotificationStatus,
} from '../../../../src/modules/notification/models/domain/notification.model';
import { Email } from '../../../../src/shared/domain/email.vo';
import { BrazilianPhone } from '../../../../src/shared/domain/brazilian-phone.vo';

describe('NotificationModel (Domain)', () => {
  const mockId = '123e4567-e89b-12d3-a456-426614174000';

  beforeAll(() => {
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => mockId);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a valid email notification', () => {
      const emailToken = new Email('test@example.com');
      const message = 'Test message';

      const notification = NotificationModel.create(
        NotificationChannel.EMAIL,
        emailToken,
        message,
      );

      expect(notification.id).toBe(mockId);
      expect(notification.channel).toBe(NotificationChannel.EMAIL);
      expect(notification.destinationToken).toBe(emailToken);
      expect(notification.message).toBe(message);
      expect(notification.status).toBe(NotificationStatus.PENDING);
      expect(notification.createdAt).toBeInstanceOf(Date);
      expect(notification.updatedAt).toBeInstanceOf(Date);
      expect(notification.sentAt).toBeUndefined();
      expect(notification.errorMessage).toBeUndefined();
    });

    it('should create a valid WhatsApp notification', () => {
      const phoneToken = new BrazilianPhone('11999999999');
      const message = 'Test message';

      const notification = NotificationModel.create(
        NotificationChannel.WHATSAPP,
        phoneToken,
        message,
      );

      expect(notification.id).toBe(mockId);
      expect(notification.channel).toBe(NotificationChannel.WHATSAPP);
      expect(notification.destinationToken).toBe(phoneToken);
      expect(notification.message).toBe(message);
      expect(notification.status).toBe(NotificationStatus.PENDING);
    });

    it('should create a valid SMS notification', () => {
      const phoneToken = new BrazilianPhone('11999999999');
      const message = 'Test message';

      const notification = NotificationModel.create(
        NotificationChannel.SMS,
        phoneToken,
        message,
      );

      expect(notification.channel).toBe(NotificationChannel.SMS);
      expect(notification.destinationToken).toBe(phoneToken);
    });

    it('should create a valid monitor notification', () => {
      const monitorId = 'monitor-123';
      const message = 'Test message';

      const notification = NotificationModel.create(
        NotificationChannel.MONITOR,
        monitorId,
        message,
      );

      expect(notification.channel).toBe(NotificationChannel.MONITOR);
      expect(notification.destinationToken).toBe(monitorId);
    });
  });

  describe('restore', () => {
    it('should restore a notification from props', () => {
      const now = new Date();
      const emailToken = new Email('test@example.com');

      const notification = NotificationModel.restore({
        id: 'test-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailToken,
        message: 'Test message',
        status: NotificationStatus.SENT,
        sentAt: now,
        createdAt: now,
        updatedAt: now,
      });

      expect(notification.id).toBe('test-id');
      expect(notification.channel).toBe(NotificationChannel.EMAIL);
      expect(notification.destinationToken).toBe(emailToken);
      expect(notification.message).toBe('Test message');
      expect(notification.status).toBe(NotificationStatus.SENT);
      expect(notification.sentAt).toBe(now);
      expect(notification.createdAt).toBe(now);
      expect(notification.updatedAt).toBe(now);
    });
  });

  describe('validation', () => {
    it('should throw if invalid channel is provided for email', () => {
      const emailToken = new Email('test@example.com');

      expect(() => {
        NotificationModel.create(
          'INVALID_CHANNEL' as NotificationChannel,
          emailToken,
          'message',
        );
      }).toThrow('Invalid channel');
    });

    it('should throw if wrong token type is provided for email', () => {
      const phoneToken = new BrazilianPhone('11999999999');

      expect(() => {
        NotificationModel.create(
          NotificationChannel.EMAIL,
          phoneToken,
          'message',
        );
      }).toThrow('Destination token must be a valid email for Email channel');
    });

    it('should throw if wrong token type is provided for WhatsApp', () => {
      const emailToken = new Email('test@example.com');

      expect(() => {
        NotificationModel.create(
          NotificationChannel.WHATSAPP,
          emailToken,
          'message',
        );
      }).toThrow(
        'Destination token must be a valid Brazilian phone number for WhatsApp',
      );
    });

    it('should throw if wrong token type is provided for SMS', () => {
      const emailToken = new Email('test@example.com');

      expect(() => {
        NotificationModel.create(
          NotificationChannel.SMS,
          emailToken,
          'message',
        );
      }).toThrow(
        'Destination token must be a valid Brazilian phone number for SMS',
      );
    });

    it('should throw if wrong token type is provided for monitor', () => {
      const phoneToken = new BrazilianPhone('11999999999');

      expect(() => {
        NotificationModel.create(
          NotificationChannel.MONITOR,
          phoneToken,
          'message',
        );
      }).toThrow('Destination token must be a string for Monitor channel');
    });

    it('should throw if empty message is provided', () => {
      const emailToken = new Email('test@example.com');

      expect(() => {
        NotificationModel.create(NotificationChannel.EMAIL, emailToken, '');
      }).toThrow('Message is required');
    });
  });

  describe('state changes', () => {
    it('should set error state', () => {
      const emailToken = new Email('test@example.com');
      const notification = NotificationModel.create(
        NotificationChannel.EMAIL,
        emailToken,
        'Test message',
      );

      notification.setError('Failed to send notification');

      expect(notification.status).toBe(NotificationStatus.FAILED);
      expect(notification.errorMessage).toBe('Failed to send notification');
      expect(notification.updatedAt).toBeInstanceOf(Date);
    });

    it('should set sent state', () => {
      const emailToken = new Email('test@example.com');
      const notification = NotificationModel.create(
        NotificationChannel.EMAIL,
        emailToken,
        'Test message',
      );

      notification.setSent();

      expect(notification.status).toBe(NotificationStatus.SENT);
      expect(notification.sentAt).toBeInstanceOf(Date);
      expect(notification.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw if failed status has no error message', () => {
      const now = new Date();
      const emailToken = new Email('test@example.com');

      expect(() => {
        NotificationModel.restore({
          id: 'test-id',
          channel: NotificationChannel.EMAIL,
          destinationToken: emailToken,
          message: 'Test message',
          status: NotificationStatus.FAILED,
          createdAt: now,
          updatedAt: now,
        });
      }).toThrow('Error message is required when status is FAILED');
    });

    it('should throw if sent status has no sentAt date', () => {
      const now = new Date();
      const emailToken = new Email('test@example.com');

      expect(() => {
        NotificationModel.restore({
          id: 'test-id',
          channel: NotificationChannel.EMAIL,
          destinationToken: emailToken,
          message: 'Test message',
          status: NotificationStatus.SENT,
          createdAt: now,
          updatedAt: now,
        });
      }).toThrow('Sent at is required when status is SENT');
    });

    it('should throw if pending status has sentAt date', () => {
      const now = new Date();
      const emailToken = new Email('test@example.com');

      const createInvalidNotification = () => {
        return NotificationModel.restore({
          id: 'test-id',
          channel: NotificationChannel.EMAIL,
          destinationToken: emailToken,
          message: 'Test message',
          status: NotificationStatus.PENDING,
          sentAt: now,
          createdAt: now,
          updatedAt: now,
        });
      };

      expect(createInvalidNotification).toThrow(
        'Sent at should not be set when status is PENDING',
      );
    });
  });
});
