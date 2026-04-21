import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Documentation API for Risk Register')
  .setDescription('Documentation API')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'jwt',
      in: 'header',
    },
    'accessToken',
  )
  .setVersion('1.0')
  .build();
