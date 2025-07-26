import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignInInputDto, SignInOutputDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from './guards/api-key.guard';
import { BusinessException } from 'src/external/consumers/NestAPI/shared/dto/business-exception.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Login successfully',
    type: SignInOutputDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Login unauthorized',
    type: BusinessException,
  })
  @ApiBody({
    description: 'Login Data',
    type: SignInInputDto,
  })
  @ApiSecurity('api-key')
  @ApiOperation({
    summary: 'store authentication',
    description: 'api key required',
  })
  @UseGuards(ApiKeyGuard)
  @Post('login')
  async login(@Body() dto: SignInInputDto): Promise<SignInOutputDto> {
    const token = await this.authService.login(dto.email, dto.password);
    return { access_token: token };
  }
}
