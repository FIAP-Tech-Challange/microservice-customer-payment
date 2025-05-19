import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StoreService } from '../stores/stores.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private storeService: StoreService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const store = await this.storeService.findByEmail(email);

    if (!store) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!store.verifyPassword(password)) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = { sub: store.id, email: store.email };

    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
