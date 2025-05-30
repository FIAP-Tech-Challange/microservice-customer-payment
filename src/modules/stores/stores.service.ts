import {
  BadRequestException,
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
import { NotificationService } from '../notification/notification.service';
import { NotificationChannel } from '../notification/models/domain/notification.model';
import { CNPJ } from './models/domain/cnpj.vo';
import { Email } from 'src/shared/domain/email.vo';
import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';
import {
  TOTEMS_REPOSITORY_PORT_KEY,
  TotemsRepositoryPort,
} from './ports/output/totems.repository.port';

@Injectable()
export class StoresService {
  constructor(
    @Inject(STORE_REPOSITORY_PORT_KEY)
    private storesRepository: StoresRepositoryPort,
    @Inject(TOTEMS_REPOSITORY_PORT_KEY)
    private totemsRepository: TotemsRepositoryPort,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateStoreInputDto) {
    const cnpj = new CNPJ(dto.cnpj);
    const email = new Email(dto.email);
    const phone = new BrazilianPhone(dto.phone);

    const [existingByEmail, existingByCnpj] = await Promise.all([
      this.storesRepository.findByEmail(email),
      this.storesRepository.findByCnpj(cnpj),
    ]);

    if (existingByEmail) {
      throw new ConflictException('Store with this email already exists');
    }

    if (existingByCnpj) {
      throw new ConflictException('Store with this CNPJ already exists');
    }

    const store = StoreModel.create({
      cnpj: cnpj,
      email: email,
      fantasyName: dto.fantasy_name,
      name: dto.name,
      phone: phone,
      plainPassword: dto.password,
    });

    await this.storesRepository.save(store);

    await this.notificationService.sendNotification({
      channel: NotificationChannel.EMAIL,
      destination_token: store.email,
      message: `Welcome to our service, ${store.name}!`,
    });

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
    const emailValue = new Email(email);

    const store = await this.storesRepository.findByEmail(emailValue);

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

  async deleteTotem(storeId: string, totemId: string) {
    const store = await this.findById(storeId);

    let totem: TotemModel;

    try {
      totem = store.removeTotem(totemId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Totem not found in this store');
      }

      throw new BadRequestException('Error removing totem: ' + error.message);
    }

    await this.totemsRepository.remove(totem);
    await this.storesRepository.save(store);
  }
}
