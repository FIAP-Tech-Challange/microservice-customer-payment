import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreInputDto } from './../models/dtos/create-store.dto';
import { StoreModel } from './../models/domain/store.model';
import {
  STORE_REPOSITORY_PORT_KEY,
  StoresRepositoryPort,
} from './../ports/output/stores.repository.port';
import { TotemModel } from './../models/domain/totem.model';
import { NotificationService } from '../../notification/notification.service';
import { NotificationChannel } from '../../notification/models/domain/notification.model';
import { CNPJ } from './../models/domain/cnpj.vo';
import { Email } from 'src/shared/domain/email.vo';
import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';
import {
  TOTEMS_REPOSITORY_PORT_KEY,
  TotemsRepositoryPort,
} from './../ports/output/totems.repository.port';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @Inject(STORE_REPOSITORY_PORT_KEY)
    private storesRepository: StoresRepositoryPort,
    @Inject(TOTEMS_REPOSITORY_PORT_KEY)
    private totemsRepository: TotemsRepositoryPort,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateStoreInputDto) {
    try {
      this.logger.log(`Registering your store ${dto.name}`);
      const cnpj = new CNPJ(dto.cnpj);
      const email = new Email(dto.email);
      const phone = new BrazilianPhone(dto.phone);

      const [existingByEmail, existingByCnpj] = await Promise.all([
        this.storesRepository.findByEmail(email),
        this.storesRepository.findByCnpj(cnpj),
      ]);

      if (existingByEmail) {
        this.logger.log('Store with this email already exists');
        throw new ConflictException('Store with this email already exists');
      }

      if (existingByCnpj) {
        this.logger.log('Store with this CNPJ already exists');
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

      this.logger.log(`Store ${dto.name} successfully created`);
      await this.notificationService.sendNotification({
        channel: NotificationChannel.EMAIL,
        destination_token: store.email,
        message: `Welcome to our service, ${store.name}!`,
      });

      return store;
    } catch (error) {
      this.logger.log(`Error create Store ${error?.message}`);
      throw new BadRequestException(`Error create Store ${error?.message}`);
    }
  }

  async createTotem(storeId: string, totemName: string) {
    this.logger.log(`Creating a totem ${totemName} for the store ${storeId}`);

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
    this.logger.log(`Searching the store ${id}`);
    const store = await this.storesRepository.findById(id);

    if (!store) {
      this.logger.log(`Store ${id} not found`);
      throw new NotFoundException('Store not found');
    }
    this.logger.log(`Store ${id} successfully located`);
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
    this.logger.log(`Deleting totem ${totemId}`);
    const store = await this.findById(storeId);

    let totem: TotemModel;

    try {
      totem = store.removeTotem(totemId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.log(`Totem not found in this store `);
        throw new NotFoundException('Totem not found in this store');
      }

      throw new BadRequestException('Error removing totem: ' + error.message);
    }

    await this.totemsRepository.remove(totem);
    await this.storesRepository.save(store);
  }
}
