import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { Notification } from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';
import { FindNotificationByIdInputDTO } from '../DTOs/notificationInput.dto';

export class FindNotificationByIdUseCase {
  constructor(private notificationGateway: NotificationGateway) {}

  async execute(
    dto: FindNotificationByIdInputDTO,
  ): Promise<CoreResponse<Notification>> {
    const { error: findError, value: notification } =
      await this.notificationGateway.findNotificationById(dto.id);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!notification) {
      return {
        error: new ResourceNotFoundException(
          `Notification with ID ${dto.id} not found`,
        ),
        value: undefined,
      };
    }

    return { error: undefined, value: notification };
  }
}
