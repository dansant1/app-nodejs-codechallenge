import { Module } from '@nestjs/common';
import { DatabaseService } from '../../services/db-connection/db-connection.service';
import { TransactionDBService } from './transaction.service';

@Module({
    exports: [TransactionDBService],
    providers: [
        TransactionDBService, 
        DatabaseService,
    ],
})
export class TransactionDbModule {}