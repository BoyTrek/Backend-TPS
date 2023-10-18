import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const port1 = 4000;
  const port2 = 4001;

  const app = await NestFactory.create(AppModule);
  const app2 = await NestFactory.create(AppModule);

  // Set global prefixes
  app.setGlobalPrefix('/api/v1');
  app2.setGlobalPrefix('/api/v1');

  // Enable global validation input handling
  app.useGlobalPipes(new ValidateInputPipe());
  app2.useGlobalPipes(new ValidateInputPipe());

  // Enable CORS
  app.enableCors();
  app2.enableCors();

  // Configuration for Swagger
  const config = new DocumentBuilder()
    .setTitle('API TPS PLAN')
    .setDescription('API Documentation')
    .setVersion('3.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const document2 = SwaggerModule.createDocument(app2, config);
  SwaggerModule.setup('api', app2, document2);

  // Start the applications on respective ports
  await app.listen(port1);
  await app2.listen(port2);

  console.log(`Application 1 is running on: http://localhost:${port1}`);
  console.log(`Application 2 is running on: http://localhost:${port2}`);
}

bootstrap();
