import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerDoc } from './docs/swagger.docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  new SwaggerDoc().setupDocs(app);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
