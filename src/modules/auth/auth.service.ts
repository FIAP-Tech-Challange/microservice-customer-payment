import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './models/dtos/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private storesService: StoresService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const store = await this.storesService.findByEmail(email);

    if (!store) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!store.verifyPassword(password)) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload: TokenDto = { storeId: store.id, email: store.email };

    return this.jwtService.signAsync(payload);
  }
}
