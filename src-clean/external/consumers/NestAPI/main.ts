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
        const formatErrors = (errors: any[]): Record<string, any> => {
          const result: Record<string, any> = {};

          errors.forEach((error) => {
            if (error.constraints) {
              result[error.property] = Object.values(
                error.constraints as { [key: string]: string },
              ).join(', ');
            }

            if (Array.isArray(error.children) && error.children.length > 0) {
              result[error.property] = formatErrors(error.children as any[]);
            }
          });

          return result;
        };

        return new BadRequestException({
          message: 'Validation failed',
          errors: formatErrors(errors),
        });
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  new SwaggerDoc().setupDocs(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
