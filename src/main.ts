import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — ajustar en producción al dominio del frontend
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://crm.rammux.com']
      : true,
  });

  // Swagger — documentación interactiva en /api/docs
  const config = new DocumentBuilder()
    .setTitle('Webcol CRM API')
    .setDescription('CRM de conversión de leads para Webcol — Automatización con IA')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('https://crm.rammux.com', 'Producción')
    .addServer('http://localhost:3000', 'Desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`CRM Webcol corriendo en: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
