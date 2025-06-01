/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationRepositoryTypeORM } from '../../../../../src/modules/notification/adapters/secondary/notification.repository.typeorm';
import { NotificationEntity } from '../../../../../src/modules/notification/models/entities/notification.entity';
import {
  NotificationModel,
  NotificationChannel,
  NotificationStatus,
} from '../../../../../src/modules/notification/models/domain/notification.model';
import { NotificationMapper } from '../../../../../src/modules/notification/models/notification.mapper';
import { Email } from '../../../../../src/shared/domain/email.vo';

jest.mock('../../../../../src/modules/notification/models/notification.mapper');

describe('NotificationRepositoryTypeORM', () => {
  let repository: NotificationRepositoryTypeORM;
  let notificationEntityRepo: Repository<NotificationEntity>;
  let mockNotification: NotificationModel;
  let mockEntity: NotificationEntity;

  beforeEach(async () => {
    mockNotification = {
      id: 'test-id',
      channel: NotificationChannel.EMAIL,
      destinationToken: new Email('test@example.com'),
      message: 'Test message',
      status: NotificationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as NotificationModel;

    mockEntity = {
      id: 'test-id',
      channel: NotificationChannel.EMAIL,
      destination_token: 'test@example.com',
      message: 'Test message',
      status: NotificationStatus.PENDING,
      created_at: new Date(),
      updated_at: new Date(),
    };

    (NotificationMapper.toEntity as jest.Mock).mockReturnValue(mockEntity);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationRepositoryTypeORM,
        {
          provide: getRepositoryToken(NotificationEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(mockEntity),
          },
        },
      ],
    }).compile();

    repository = module.get<NotificationRepositoryTypeORM>(
      NotificationRepositoryTypeORM,
    );
    notificationEntityRepo = module.get<Repository<NotificationEntity>>(
      getRepositoryToken(NotificationEntity),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      await repository.create(mockNotification);

      expect(NotificationMapper.toEntity).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(notificationEntityRepo.save).toHaveBeenCalledWith(mockEntity);
    });
  });

  describe('update', () => {
    it('should update a notification', async () => {
      await repository.update(mockNotification);

      expect(NotificationMapper.toEntity).toHaveBeenCalledWith(
        mockNotification,
      );
      expect(notificationEntityRepo.save).toHaveBeenCalledWith(mockEntity);
    });
  });
});
