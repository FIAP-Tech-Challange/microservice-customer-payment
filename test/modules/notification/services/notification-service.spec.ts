/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { NotificationService } from '../../../../src/modules/notification/notification.service';
import {
  NotificationModel,
  NotificationChannel,
  NotificationStatus,
} from '../../../../src/modules/notification/models/domain/notification.model';
import { NotificationRepositoryPort } from '../../../../src/modules/notification/ports/output/notification.repository.port';
import { NotificationChannelFactory } from '../../../../src/modules/notification/adapters/secondary/notification.channel.factory';
import { NotificationChannelPort } from '../../../../src/modules/notification/ports/output/notification.channel.port';
import { Email } from '../../../../src/shared/domain/email.vo';
import { BrazilianPhone } from '../../../../src/shared/domain/brazilian-phone.vo';

jest.mock(
  '../../../../src/modules/notification/models/domain/notification.model',
  () => {
    const originalModule = jest.requireActual(
      '../../../../src/modules/notification/models/domain/notification.model',
    );
    return {
      ...originalModule,
      NotificationModel: {
        ...originalModule.NotificationModel,
        create: jest.fn(),
      },
      NotificationStatus: originalModule.NotificationStatus,
      NotificationChannel: originalModule.NotificationChannel,
    };
  },
);

jest.mock(
  '../../../../src/modules/notification/adapters/secondary/notification.channel.factory',
  () => {
    return {
      NotificationChannelFactory: {
        create: jest.fn(),
      },
    };
  },
);

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: jest.Mocked<NotificationRepositoryPort>;
  let mockNotificationChannel: jest.Mocked<NotificationChannelPort>;
  let mockNotification: Partial<NotificationModel>;

  beforeEach(() => {
    mockNotificationChannel = {
      sendNotification: jest.fn(),
    };

    notificationRepository = {
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    };

    mockNotification = {
      id: 'mock-id',
      channel: NotificationChannel.EMAIL,
      destinationToken: new Email('test@example.com'),
      message: 'Test message',
      status: NotificationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      setSent: jest.fn(),
      setError: jest.fn(),
    };

    (NotificationModel.create as jest.Mock).mockReturnValue(mockNotification);
    (NotificationChannelFactory.create as jest.Mock).mockReturnValue(
      mockNotificationChannel,
    );

    service = new NotificationService(notificationRepository);
  });

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      const notificationDto = {
        channel: NotificationChannel.EMAIL,
        destination_token: new Email('test@example.com'),
        message: 'Test message',
      };

      mockNotificationChannel.sendNotification.mockResolvedValue({
        success: true,
      });

      const result = await service.sendNotification(notificationDto);

      expect(NotificationModel.create).toHaveBeenCalledWith(
        notificationDto.channel,
        notificationDto.destination_token,
        notificationDto.message,
      );
      expect(notificationRepository.create).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(NotificationChannelFactory.create).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(mockNotificationChannel.sendNotification).toHaveBeenCalledWith(
        mockNotification.destinationToken,
        mockNotification.message,
      );
      expect(mockNotification.setSent).toHaveBeenCalled();
      expect(notificationRepository.update).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle failed notification', async () => {
      const notificationDto = {
        channel: NotificationChannel.SMS,
        destination_token: new BrazilianPhone('11999999999'),
        message: 'Test message',
      };

      const errorMessage = 'Failed to send SMS';
      mockNotificationChannel.sendNotification.mockResolvedValue({
        success: false,
        error_message: errorMessage,
      });

      const result = await service.sendNotification(notificationDto);

      expect(NotificationModel.create).toHaveBeenCalledWith(
        notificationDto.channel,
        notificationDto.destination_token,
        notificationDto.message,
      );
      expect(notificationRepository.create).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(NotificationChannelFactory.create).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(mockNotificationChannel.sendNotification).toHaveBeenCalledWith(
        mockNotification.destinationToken,
        mockNotification.message,
      );
      expect(mockNotification.setError).toHaveBeenCalledWith(errorMessage);
      expect(notificationRepository.update).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(result).toEqual({ success: false, error_message: errorMessage });
    });

    it('should handle WhatsApp notifications', async () => {
      const notificationDto = {
        channel: NotificationChannel.WHATSAPP,
        destination_token: new BrazilianPhone('11999999999'),
        message: 'Test message',
      };

      mockNotification.channel = NotificationChannel.WHATSAPP;
      mockNotification.destinationToken = notificationDto.destination_token;
      mockNotificationChannel.sendNotification.mockResolvedValue({
        success: true,
      });

      await service.sendNotification(notificationDto);

      expect(NotificationModel.create).toHaveBeenCalledWith(
        NotificationChannel.WHATSAPP,
        notificationDto.destination_token,
        notificationDto.message,
      );
    });

    it('should handle Monitor notifications', async () => {
      const notificationDto = {
        channel: NotificationChannel.MONITOR,
        destination_token: 'monitor-id-123',
        message: 'Test message',
      };

      mockNotification.channel = NotificationChannel.MONITOR;
      mockNotification.destinationToken = notificationDto.destination_token;
      mockNotificationChannel.sendNotification.mockResolvedValue({
        success: true,
      });

      await service.sendNotification(notificationDto);

      expect(NotificationModel.create).toHaveBeenCalledWith(
        NotificationChannel.MONITOR,
        notificationDto.destination_token,
        notificationDto.message,
      );
    });
  });
});
