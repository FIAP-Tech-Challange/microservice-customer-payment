import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoreTokenInterface } from '../dtos/token.dto';
import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreCoreController } from 'src-clean/core/modules/store/controllers/store.controller';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string, dataSource: DataSource) {
    const controller = new StoreCoreController(dataSource);

    const { error: err, value: store } =
      await controller.findStoreByEmail(email);

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error('Ops! Something went wrong');
      }

      throw new UnauthorizedException('Email or password invalid');
    }

    const { error: isValidErr, value: isValid } =
      await controller.validateStorePassword({
        email: email,
        password: password,
      });

    if (isValidErr) {
      if (isValidErr.code === UnexpectedError.CODE) {
        throw new Error('Ops! Something went wrong');
      }

      throw new UnauthorizedException('Email or password invalid');
    }

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
