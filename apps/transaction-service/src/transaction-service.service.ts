import { Injectable, Inject } from '@nestjs/common';
import {
  TransactionDBService,
} from '../../db/transaction-db/transaction.service';

@Injectable()
export class TransactionServiceService {

  constructor(
    @Inject('TransactionDBService')
    private transactionDBService: TransactionDBService,
  ) {}

  async create(body): Promise<any> {
    console.log('BODY=', body);
    //await this.transactionDBService.create(body);
    return {
      value: {
        value: 145,
        status: 'pending',
        externalId: '123',
        type: 2,
        accountExternalIdDebit: '',
        accountExternalIdCredit: '',
        createdAt: new Date(),
      }
    }
  }
}
