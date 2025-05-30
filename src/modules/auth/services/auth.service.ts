import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StoresService } from '../../stores/stores.service';
import { JwtService } from '@nestjs/jwt';
import { StoreTokenInterface } from '../models/dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private storesService: StoresService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      const store = await this.storesService.findByEmail(email);

      if (!store.verifyPassword(password)) {
        throw new UnauthorizedException('Incorrect password');
      }

      const payload: StoreTokenInterface = {
        storeId: store.id,
        email: store.email.toString(),
      };

      return this.jwtService.signAsync(payload);
    } catch {
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }
}
