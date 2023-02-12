import { Module } from '@nestjs/common';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';
import {
  TransactionDbModule
} from '../../db/transaction-db/transaction.module';
@Module({
  imports: [
    TransactionDbModule,
  ],
  controllers: [TransactionServiceController],
  providers: [TransactionServiceService],
})
export class TransactionServiceModule {}
