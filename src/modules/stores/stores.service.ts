import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreInputDto } from './models/dtos/create-store.dto';
import { StoreModel } from './models/domain/store.model';
import {
  STORE_REPOSITORY_PORT_KEY,
  StoresRepositoryPort,
} from './ports/output/stores.repository.port';
import { TotemModel } from './models/domain/totem.model';

@Injectable()
export class StoresService {
  constructor(
    @Inject(STORE_REPOSITORY_PORT_KEY)
    private storesRepository: StoresRepositoryPort,
  ) {}

  async create(dto: CreateStoreInputDto) {
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

    await this.storesRepository.save(store);

    return store;
  }

  async createTotem(storeId: string, totemName: string) {
    const store = await this.findById(storeId);

    const totem = TotemModel.create({ name: totemName });
    store.addTotem(totem);

    await this.storesRepository.save(store);

    return totem;
  }

  async findByEmail(email: string) {
    const store = await this.storesRepository.findByEmail(email);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async findById(id: string) {
    const store = await this.storesRepository.findById(id);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async findByTotemAccessToken(tokenAccess: string) {
    const store =
      await this.storesRepository.findByTotemAccessToken(tokenAccess);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async inactivateTotem(storeId: string, totemId: string) {
    const store = await this.findById(storeId);

    store.inactivateTotem(totemId);

    await this.storesRepository.save(store);
  }
}
