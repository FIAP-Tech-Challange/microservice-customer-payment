import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Totem } from '../entities/totem.entity';
import { TotemDataSourceDTO } from 'src/common/dataSource/DTOs/totemDataSource.dto';

export class TotemMapper {
  static toEntity(dto: TotemDataSourceDTO): CoreResponse<Totem> {
    return Totem.restore({
      id: dto.id,
      name: dto.name,
      tokenAccess: dto.token_access,
      createdAt: new Date(dto.created_at),
    });
  }

  static toPersistenceDTO(entity: Totem): TotemDataSourceDTO {
    return {
      id: entity.id,
      name: entity.name,
      token_access: entity.tokenAccess,
      created_at: entity.createdAt.toISOString(),
    };
  }
}
