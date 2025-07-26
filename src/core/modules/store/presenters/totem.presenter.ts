import { TotemDTO } from '../DTOs/totem.dto';
import { Totem } from '../entities/totem.entity';

export class TotemPresenter {
  static toDto(totem: Totem): TotemDTO {
    return {
      id: totem.id,
      name: totem.name,
      tokenAccess: totem.tokenAccess,
    };
  }
}
