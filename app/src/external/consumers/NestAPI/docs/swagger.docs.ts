import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

export class SwaggerDoc {
  setupDocs = (app: INestApplication) => {
    const title = 'Microservice Customer and Payment';
    const description = `This application is a micro service for the cafeteria that provides customer and payment data.`;
    const version = '1.0.0';

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
        },
        'api-key',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-external-payment-consumer-key',
          in: 'header',
        },
        'x-external-payment-consumer-key',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
    writeFileSync('./swagger-docs.json', JSON.stringify(document));
  };
}
