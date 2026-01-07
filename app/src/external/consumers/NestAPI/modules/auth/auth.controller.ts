import { Controller } from '@nestjs/common';
import {
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
export class AuthController {}
