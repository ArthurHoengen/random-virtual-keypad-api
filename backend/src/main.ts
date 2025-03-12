import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { version } from '../package.json';

import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.use(cors());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Teclado Virtual BackEnd')
    .setDescription('Teclado Virtual API')
    .setVersion(version)
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setExternalDoc('/api-json', '/api-json')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
  });

  const CustomOptions = {
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customSiteTitle: 'Teclado Virtual',
  };

  SwaggerModule.setup('api', app, document, CustomOptions);

  await app.listen(8080);
}

bootstrap();
