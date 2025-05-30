import { TotemModel } from '../../models/domain/totem.model';

export interface TotemsRepositoryPort {
  remove(totem: TotemModel): Promise<void>;
}

export const TOTEMS_REPOSITORY_PORT_KEY = Symbol('TotemsRepositoryPort');
