import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdir } from 'fs/promises';

async function start() {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await mkdir('./static/uploads', { recursive: true });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  });

  app.setGlobalPrefix('/api/v1');
  app.useStaticAssets(join(__dirname, '..', 'static', 'uploads'), {
    prefix: '/static/uploads',
  });



  const config = new DocumentBuilder()
    .setTitle('NestJS Backend')
    .setDescription('REST API Documentation')
    .setVersion('1.0.0')
    .addTag('NestJS')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('/api/docs', app as any, document);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
