import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });


  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Mamba Culture API')
    .setDescription('Mamba campaign management API')
    .setVersion('1.0')
    .addTag('campaigns', 'Campaign management endpoints')
    .addTag('categories', 'Category management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();


process
  .on('unhandledRejection', (reason, p) => {
    Logger.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    Logger.error(err, 'Uncaught Exception thrown');
  });
