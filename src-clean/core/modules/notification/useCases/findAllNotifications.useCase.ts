import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Notification } from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';
import { FindAllNotificationsInputDTO } from '../DTOs/notificationInput.dto';

export class FindAllNotificationsUseCase {
  constructor(private notificationGateway: NotificationGateway) {}

  async execute(
    dto: FindAllNotificationsInputDTO,
  ): Promise<CoreResponse<Notification[]>> {
    const { error: findError, value: notifications } =
      await this.notificationGateway.findAllNotifications(dto);

    if (findError) {
      return { error: findError, value: undefined };
    }

    return { error: undefined, value: notifications };
  }
}
