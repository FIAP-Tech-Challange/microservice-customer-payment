import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Totem } from '../entities/totem.entity';
import { TotemMapper } from '../mappers/totem.mapper';

export class TotemGateway {
  constructor(private dataSource: DataSource) {}

  async findTotemByAccessToken(
    accessToken: string,
  ): Promise<CoreResponse<Totem | null>> {
    const totemDTO = await this.dataSource.findTotemByAccessToken(accessToken);
    if (!totemDTO) return { error: undefined, value: null };

    const totemEntity = TotemMapper.toEntity(totemDTO);
    if (totemEntity.error)
      return { error: totemEntity.error, value: undefined };

    return { error: undefined, value: totemEntity.value };
  }
}
