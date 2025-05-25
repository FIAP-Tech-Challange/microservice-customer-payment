import { NotificationModel } from '../../models/domain/notification.model';

export const NOTIFICATION_REPOSITORY_PORT_KEY = 'NotificationRepositoryPort';

export interface NotificationRepositoryPort {
  create(notification: NotificationModel): Promise<void>;
  update(notification: NotificationModel): Promise<void>;
}
