import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  VersioningType,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { SwaggerDoc } from './docs/swagger.docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const result = {};
        errors.forEach((error) => {
          if (error.constraints) {
            result[error.property] = Object.values(error.constraints).join(
              ', ',
            );
          }
        });
        return new BadRequestException({
          message: 'Validation failed',
          errors: result,
        });
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  new SwaggerDoc().setupDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
