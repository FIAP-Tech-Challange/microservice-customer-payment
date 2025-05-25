import { InjectRepository } from '@nestjs/typeorm';
import { NotificationModel } from '../../models/domain/notification.model';
import { NotificationRepositoryPort } from '../../ports/output/notification.repository.port';
import { NotificationEntity } from '../../models/entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationMapper } from '../../models/notification.mapper';

export class NotificationRepositoryTypeORM
  implements NotificationRepositoryPort
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationEntity: Repository<NotificationEntity>,
  ) {}

  async create(notification: NotificationModel): Promise<void> {
    await this.notificationEntity.save(
      NotificationMapper.toEntity(notification),
    );
  }

  async update(notification: NotificationModel): Promise<void> {
    await this.notificationEntity.save(
      NotificationMapper.toEntity(notification),
    );
  }
}
