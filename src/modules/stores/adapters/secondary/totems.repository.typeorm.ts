import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TotemEntity } from '../../models/entities/totem.entity';
import { TotemsRepositoryPort } from '../../ports/output/totems.repository.port';
import { TotemModel } from '../../models/domain/totem.model';
import { TotemMapper } from '../../models/totem.mapper';

@Injectable()
export class TotemsRepositoryTypeORM implements TotemsRepositoryPort {
  constructor(
    @InjectRepository(TotemEntity)
    private readonly totemEntity: Repository<TotemEntity>,
  ) {}

  async remove(totem: TotemModel): Promise<void> {
    const entity = TotemMapper.toEntity(totem);
    await this.totemEntity.remove(entity);
  }
}
