import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  @Get()
  check() {
    return { message: 'App is up' };
  }
}
