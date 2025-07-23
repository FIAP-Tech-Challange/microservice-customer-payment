import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Notification } from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';
import { FindNotificationsByStatusInputDTO } from '../DTOs/notificationInput.dto';

export class FindNotificationsByStatusUseCase {
  constructor(private notificationGateway: NotificationGateway) {}

  async execute(
    dto: FindNotificationsByStatusInputDTO,
  ): Promise<CoreResponse<Notification[]>> {
    const { error: findError, value: notifications } =
      await this.notificationGateway.findNotificationsByStatus(dto);

    if (findError) {
      return { error: findError, value: undefined };
    }

    return { error: undefined, value: notifications };
  }
}
