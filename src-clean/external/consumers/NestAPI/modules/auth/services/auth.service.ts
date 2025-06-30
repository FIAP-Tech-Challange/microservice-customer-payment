import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoreTokenInterface } from '../dtos/token.dto';
import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreCoreController } from 'src-clean/core/modules/store/controllers/store.controller';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string, dataSource: DataSource) {
    const controller = new StoreCoreController(dataSource);

    const store = await controller.findStoreByEmail(email);

    const isValid = await controller.validateStorePassword({
      email: email,
      password: password,
    });

    if (!isValid) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const payload: StoreTokenInterface = {
      storeId: store.id,
      email: store.email,
    };

    return this.jwtService.signAsync(payload);
  }
}
