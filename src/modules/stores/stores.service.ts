import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateStoreInputDto } from './models/dtos/create-store.dto';
import { StoreModel } from './models/domain/store.model';
import {
  STORE_REPOSITORY_PORT_KEY,
  StoresRepositoryPort,
} from './ports/output/stores.repository.port';

@Injectable()
export class StoresService {
  constructor(
    @Inject(STORE_REPOSITORY_PORT_KEY)
    private storesRepository: StoresRepositoryPort,
  ) {}

  async create(dto: CreateStoreInputDto): Promise<StoreModel> {
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
