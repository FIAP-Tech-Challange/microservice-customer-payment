import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoreTokenInterface } from './dtos/token.dto';
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dataSourceProxy: DataSourceProxy,
  ) {}

  async login(email: string, password: string) {
    try {
      const coreController = new StoreCoreController(this.dataSourceProxy);
      const findStoreByEmail = await coreController.findStoreByEmail(email);
      if (findStoreByEmail.error) {
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const validatePassword = await coreController.validateStorePassword({
        email,
        password,
      });
      if (validatePassword.error || validatePassword.value === false) {
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const payload: StoreTokenInterface = {
        storeId: findStoreByEmail.value.id,
        email: findStoreByEmail.value.email,
      };

      return this.jwtService.signAsync(payload);
    } catch {
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }
}
