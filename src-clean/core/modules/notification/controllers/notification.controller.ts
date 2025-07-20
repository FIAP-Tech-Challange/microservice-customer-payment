import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { NotificationDTO } from '../DTOs/notification.dto';
import { NotificationGateway } from '../gateways/notification.gateway';
import { CreateNotificationUseCase } from '../useCases/createNotification.useCase';
import { FindNotificationByIdUseCase } from '../useCases/findNotificationById.useCase';
import { FindAllNotificationsUseCase } from '../useCases/findAllNotifications.useCase';
import { FindNotificationsByStatusUseCase } from '../useCases/findNotificationsByStatus.useCase';
import { UpdateNotificationStatusUseCase } from '../useCases/updateNotificationStatus.useCase';
import { NotificationPresenter } from '../presenters/notification.presenter';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import {
  CreateNotificationInputDTO,
  FindNotificationByIdInputDTO,
  FindAllNotificationsInputDTO,
  FindNotificationsByStatusInputDTO,
  UpdateNotificationStatusInputDTO,
} from '../DTOs/notificationInput.dto';

export class NotificationCoreController {
  constructor(private dataSource: DataSource) {}

  async createNotification(
    dto: CreateNotificationInputDTO,
  ): Promise<CoreResponse<NotificationDTO>> {
    try {
      const gateway = new NotificationGateway(this.dataSource);
      const useCase = new CreateNotificationUseCase(gateway);

      const { error: err, value: notification } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return {
        error: undefined,
        value: NotificationPresenter.toDTO(notification),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while creating notification',
        ),
        value: undefined,
      };
    }
  }

  async findNotificationById(
    dto: FindNotificationByIdInputDTO,
  ): Promise<CoreResponse<NotificationDTO>> {
    try {
      const gateway = new NotificationGateway(this.dataSource);
      const useCase = new FindNotificationByIdUseCase(gateway);

      const { error: err, value: notification } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return {
        error: undefined,
        value: NotificationPresenter.toDTO(notification),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding notification',
        ),
        value: undefined,
      };
    }
  }

  async findAllNotifications(
    dto: FindAllNotificationsInputDTO,
  ): Promise<CoreResponse<NotificationDTO[]>> {
    try {
      const gateway = new NotificationGateway(this.dataSource);
      const useCase = new FindAllNotificationsUseCase(gateway);

      const { error: err, value: notifications } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return {
        error: undefined,
        value: notifications.map((notification) =>
          NotificationPresenter.toDTO(notification),
        ),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding notifications',
        ),
        value: undefined,
      };
    }
  }

  async findNotificationsByStatus(
    dto: FindNotificationsByStatusInputDTO,
  ): Promise<CoreResponse<NotificationDTO[]>> {
    try {
      const gateway = new NotificationGateway(this.dataSource);
      const useCase = new FindNotificationsByStatusUseCase(gateway);

      const { error: err, value: notifications } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return {
        error: undefined,
        value: notifications.map((notification) =>
          NotificationPresenter.toDTO(notification),
        ),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding notifications by status',
        ),
        value: undefined,
      };
    }
  }

  async updateNotificationStatus(
    dto: UpdateNotificationStatusInputDTO,
  ): Promise<CoreResponse<NotificationDTO>> {
    try {
      const gateway = new NotificationGateway(this.dataSource);
      const useCase = new UpdateNotificationStatusUseCase(gateway);

      const { error: err, value: notification } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return {
        error: undefined,
        value: NotificationPresenter.toDTO(notification),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while updating notification status',
        ),
        value: undefined,
      };
    }
  }
}
