import { NestFactory } from '@nestjs/core';
import { AntifraudEngineServiceModule } from './antifraud-engine-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AntifraudEngineServiceModule);
  await app.listen(3000);
}
bootstrap();
