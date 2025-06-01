import { NotificationMapper } from '../../../../src/modules/notification/models/notification.mapper';
import { NotificationEntity } from '../../../../src/modules/notification/models/entities/notification.entity';
import {
  NotificationChannel,
  NotificationModel,
  NotificationStatus,
} from '../../../../src/modules/notification/models/domain/notification.model';
import { Email } from '../../../../src/shared/domain/email.vo';
import { BrazilianPhone } from '../../../../src/shared/domain/brazilian-phone.vo';

describe('NotificationMapper', () => {
  describe('toEntity', () => {
    it('should map a domain model to an entity (Email)', () => {
      const now = new Date();
      const emailToken = new Email('test@example.com');

      const notification: NotificationModel = {
        id: 'test-id',
        channel: NotificationChannel.EMAIL,
        destinationToken: emailToken,
        message: 'Test message',
        status: NotificationStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      } as NotificationModel;

      const entity = NotificationMapper.toEntity(notification);

      expect(entity.id).toBe('test-id');
      expect(entity.channel).toBe(NotificationChannel.EMAIL);
      expect(entity.destination_token).toBe(emailToken.toString());
      expect(entity.message).toBe('Test message');
      expect(entity.status).toBe(NotificationStatus.PENDING);
      expect(entity.created_at).toBe(now);
      expect(entity.updated_at).toBe(now);
      expect(entity.sent_at).toBeUndefined();
      expect(entity.error_message).toBeUndefined();
    });

    it('should map a domain model to an entity (Phone)', () => {
      const now = new Date();
      const phoneToken = new BrazilianPhone('11999999999');

      const notification: NotificationModel = {
        id: 'test-id',
        channel: NotificationChannel.WHATSAPP,
        destinationToken: phoneToken,
        message: 'Test message',
        status: NotificationStatus.SENT,
        sentAt: now,
        createdAt: now,
        updatedAt: now,
      } as NotificationModel;

      const entity = NotificationMapper.toEntity(notification);

      expect(entity.id).toBe('test-id');
      expect(entity.channel).toBe(NotificationChannel.WHATSAPP);
      expect(entity.destination_token).toBe(phoneToken.toString());
      expect(entity.status).toBe(NotificationStatus.SENT);
      expect(entity.sent_at).toBe(now);
    });

    it('should map a domain model to an entity (String)', () => {
      const now = new Date();
      const monitorId = 'monitor-123';

      const notification: NotificationModel = {
        id: 'test-id',
        channel: NotificationChannel.MONITOR,
        destinationToken: monitorId,
        message: 'Test message',
        status: NotificationStatus.FAILED,
        errorMessage: 'Failed to send',
        createdAt: now,
        updatedAt: now,
      } as NotificationModel;

      const entity = NotificationMapper.toEntity(notification);

      expect(entity.id).toBe('test-id');
      expect(entity.channel).toBe(NotificationChannel.MONITOR);
      expect(entity.destination_token).toBe(monitorId);
      expect(entity.status).toBe(NotificationStatus.FAILED);
      expect(entity.error_message).toBe('Failed to send');
    });
  });

  describe('toDomain', () => {
    it('should map an entity to a domain model (Email)', () => {
      const now = new Date();

      const entity: NotificationEntity = {
        id: 'test-id',
        channel: NotificationChannel.EMAIL,
        destination_token: 'test@example.com',
        message: 'Test message',
        status: NotificationStatus.PENDING,
        created_at: now,
        updated_at: now,
      } as NotificationEntity;

      const model = NotificationMapper.toDomain(entity);

      expect(model.id).toBe('test-id');
      expect(model.channel).toBe(NotificationChannel.EMAIL);
      expect(model.destinationToken).toBeInstanceOf(Email);
      expect((model.destinationToken as Email).toString()).toBe(
        'test@example.com',
      );
      expect(model.message).toBe('Test message');
      expect(model.status).toBe(NotificationStatus.PENDING);
      expect(model.createdAt).toBe(now);
      expect(model.updatedAt).toBe(now);
    });

    it('should map an entity to a domain model (WhatsApp)', () => {
      const now = new Date();

      const entity: NotificationEntity = {
        id: 'test-id',
        channel: NotificationChannel.WHATSAPP,
        destination_token: '11999999999',
        message: 'Test message',
        status: NotificationStatus.SENT,
        sent_at: now,
        created_at: now,
        updated_at: now,
      } as NotificationEntity;

      const model = NotificationMapper.toDomain(entity);

      expect(model.id).toBe('test-id');
      expect(model.channel).toBe(NotificationChannel.WHATSAPP);
      expect(model.destinationToken).toBeInstanceOf(BrazilianPhone);
      expect((model.destinationToken as BrazilianPhone).toString()).toBe(
        '5511999999999',
      );
      expect(model.status).toBe(NotificationStatus.SENT);
      expect(model.sentAt).toBe(now);
    });

    it('should map an entity to a domain model (Monitor)', () => {
      const now = new Date();

      const entity: NotificationEntity = {
        id: 'test-id',
        channel: NotificationChannel.MONITOR,
        destination_token: 'monitor-123',
        message: 'Test message',
        status: NotificationStatus.FAILED,
        error_message: 'Failed to send',
        created_at: now,
        updated_at: now,
      } as NotificationEntity;

      const model = NotificationMapper.toDomain(entity);

      expect(model.id).toBe('test-id');
      expect(model.channel).toBe(NotificationChannel.MONITOR);
      expect(model.destinationToken).toBe('monitor-123');
      expect(model.status).toBe(NotificationStatus.FAILED);
      expect(model.errorMessage).toBe('Failed to send');
    });
  });
});
