import { Body, Controller, Post } from '@nestjs/common';
import { SignInInputDto, SignInOutputDto } from '../../models/dtos/sign-in.dto';
import { AuthService } from '../../services/auth.service';
import { AuthPort } from '../../ports/input/auth.port';

@Controller('auth')
export class AuthController implements AuthPort {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: SignInInputDto): Promise<SignInOutputDto> {
    const token = await this.authService.login(dto.email, dto.password);
    return { access_token: token };
  }
}
