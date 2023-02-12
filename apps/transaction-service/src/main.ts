import { NestFactory } from '@nestjs/core';
import { TransactionServiceModule } from './transaction-service.module';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
const logger = new Logger('transaction-service');
import {
  KafkaValidationPipe,
} from '../../@shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TransactionServiceModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9091'],
      },
      consumer: {
        groupId: 'transaction-consumer' 
      },
    }
  });
  await app.listen();
  logger.log('Microservice is running');
}
bootstrap();
