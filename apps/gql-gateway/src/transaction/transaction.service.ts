import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { first } from 'rxjs';
import {
  EVENT_CREATE_TRANSACTION_REQUEST,
  TRANSACTION_SERVICE,
} from '../../../@shared';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly transactionClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf(EVENT_CREATE_TRANSACTION_REQUEST);
  }

  async create(value: any): Promise<any> {
    console.log('LOG!!', value);
    return new Promise((resolve, reject) => {
      this.transactionClient
      .send(EVENT_CREATE_TRANSACTION_REQUEST, {
          value,
      })
      .pipe(first())
      .subscribe({
        next: (response) => {
          console.log('RESPONSE=', response);
          return resolve(response);
        },
        error: (err) => {
          console.error(
            err,
            `createTransaction -> [${EVENT_CREATE_TRANSACTION_REQUEST}] = Error sending message to kafka`,
          );
          return reject(err);
        },        
      });
    })
  }
}
