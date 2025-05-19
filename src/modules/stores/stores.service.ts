import { Injectable } from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoreRepository } from './ports/stores.repository';
import { CreateStoreDto } from './dtos/create-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async create(dto: CreateStoreDto): Promise<Store> {
    const [existingByEmail, existingByCnpj] = await Promise.all([
      this.storeRepository.findByEmail(dto.email),
      this.storeRepository.findByCnpj(dto.cnpj),
    ]);

    if (existingByEmail) {
      throw new Error('Store with this email already exists');
    }

    if (existingByCnpj) {
      throw new Error('Store with this CNPJ already exists');
    }

    const store = Store.create({
      cnpj: dto.cnpj,
      email: dto.email,
      fantasyName: dto.fantasy_name,
      name: dto.name,
      phone: dto.phone,
      plainPassword: dto.password,
    });

    await this.storeRepository.create(store);

    return store;
  }

  async findByEmail(email: string): Promise<Store | null> {
    return this.storeRepository.findByEmail(email);
  }
}
