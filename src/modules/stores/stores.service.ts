import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { StoresRepository } from './ports/stores.repository';
import { CreateStoreDto } from './models/dtos/create-store.dto';
import { StoreModel } from './models/domain/store.model';

@Injectable()
export class StoresService {
  constructor(
    @Inject('StoresRepository')
    private storesRepository: StoresRepository,
  ) {}

  async create(dto: CreateStoreDto): Promise<StoreModel> {
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

    const store = StoreModel.create({
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

  async findByEmail(email: string): Promise<StoreModel | null> {
    return this.storesRepository.findByEmail(email);
  }

  async findById(id: string): Promise<StoreModel | null> {
    return this.storesRepository.findById(id);
  }
}
