import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { Store } from './entities/store.entity';
import { StoreRepository } from './ports/stores.repository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const existingStore = await this.storeRepository.findByCnpj(
      createStoreDto.cnpj,
    );

    if (existingStore) {
      throw new Error('Store with this CNPJ already exists');
    }

    const store = Store.create({
      cnpj: createStoreDto.cnpj,
      email: createStoreDto.email,
      fantasyName: createStoreDto.fantasy_name,
      name: createStoreDto.name,
      phone: createStoreDto.phone,
      plainPassword: createStoreDto.password,
    });

    await this.storeRepository.create(store);

    return store;
  }

  async findById(id: string): Promise<Store> {
    const store = await this.storeRepository.findById(id);

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  }
}
