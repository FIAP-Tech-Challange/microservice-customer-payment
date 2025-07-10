import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Totem } from '../entities/totem.entity';
import { TotemGateway } from '../gateways/totem.gateway';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

export class FindStoreTotemByAccessTokenUseCase {
  constructor(private totemGateway: TotemGateway) {}

  async execute(accessToken: string): Promise<CoreResponse<Totem>> {
    const totem = await this.totemGateway.findTotemByAccessToken(accessToken);

    if (totem.error)
      return {
        error: totem.error,
        value: undefined,
      };

    if (!totem.value)
      return {
        error: new ResourceNotFoundException('Totem not found'),
        value: undefined,
      };

    return { error: undefined, value: totem.value };
  }
}
