import { TotemModel } from './domain/totem.model';
import { SimplifiedTotemDto } from './dtos/simplified-store.dto';
import { TotemEntity } from './entities/totem.entity';

export class TotemMapper {
  static toDomain(entity: TotemEntity) {
    return TotemModel.restore({
      id: entity.id,
      name: entity.name,
      tokenAccess: entity.token_access,
      createdAt: entity.created_at,
    });
  }

  static toEntity(entity: TotemModel) {
    const totemEntity = new TotemEntity();
    totemEntity.id = entity.id;
    totemEntity.name = entity.name;
    totemEntity.token_access = entity.tokenAccess;
    totemEntity.created_at = entity.createdAt;
    return totemEntity;
  }

  static fromDomainToSimplifiedTotemDto(totem: TotemModel): SimplifiedTotemDto {
    return {
      id: totem.id,
      name: totem.name,
      tokenAccess: totem.tokenAccess,
    };
  }
}
