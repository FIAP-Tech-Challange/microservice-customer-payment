import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoresRepository } from './ports/stores.repository';
import { CreateStoreDto } from './dtos/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @Inject('StoresRepository') private storesRepository: StoresRepository,
  ) {}

  async create(dto: CreateStoreDto): Promise<Store> {
    const [existingByEmail, existingByCnpj] = await Promise.all([
      this.storesRepository.findByEmail(dto.email),
      this.storesRepository.findByCnpj(dto.cnpj),
    ]);

    if (existingByEmail) {
      throw new ConflictException('Store with this email already exists');
    }

    if (existingByCnpj) {
      throw new ConflictException('Store with this CNPJ already exists');
    }

    const store = Store.create({
      cnpj: dto.cnpj,
      email: dto.email,
      fantasyName: dto.fantasy_name,
      name: dto.name,
      phone: dto.phone,
      plainPassword: dto.password,
    });

    await this.storesRepository.create(store);

    return store;
  }

  async findByEmail(email: string): Promise<Store | null> {
    return this.storesRepository.findByEmail(email);
  }

  async findById(id: string): Promise<Store | null> {
    return this.storesRepository.findById(id);
  }
}
