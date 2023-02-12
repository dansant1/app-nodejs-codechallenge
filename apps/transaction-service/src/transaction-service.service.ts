import { Injectable, Inject } from '@nestjs/common';
import { 
  Repository,
} from 'typeorm';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  ClientKafka,
} from '@nestjs/microservices';
import {
  Transaction,
} from './db';
import { v4 as uuidv4, } from 'uuid';
import {
  CreateTransactionReq,
  AntifraudReq,
} from './dto';
import {
  Feature,
  TransactionStatus,
  transferTypes,
  EVENT_GET_PENDING_TRANSACTION_REQUEST,
  ANTIFRAUD_SERVICE,
  transactionStatus,
  transferTypeName,
} from '../../@shared';

@Injectable()
export class TransactionServiceService {

  constructor(
    @Inject(ANTIFRAUD_SERVICE) private readonly antifraudEngineClient: ClientKafka,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(body: CreateTransactionReq): Promise<any> { 
    if (!transferTypes.includes(body.tranferTypeId)) {
      throw new Error('no transfer type permited');
    }
    const transactionExternalId = uuidv4();
    const model = this.transactionRepository.create({
      transactionExternalId,
      value: body.value,
      transactionStatusId: TransactionStatus.PENDING,
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
      transactionTypeId: body.tranferTypeId,
    });
    
    const result = await this.transactionRepository.save(model);
    this.antifraudEngineClient
    .emit(EVENT_GET_PENDING_TRANSACTION_REQUEST, {
      value: {
        transactionId: result.id,
      }
    });
    return {
      value: {
        value: result.value,
        transactionExternalId,
        transactionType: {
          name: transferTypeName[body.tranferTypeId],
        },
        transactionStatus: {
          name: transactionStatus[TransactionStatus.PENDING],
        },
        createdAt: result.createdAt,
      }
    }
  }

  async updateTransactionStatusByAntifraudFeature(antifraudReq: AntifraudReq): Promise<void> {
    const {
      features: antifraudFeatures = [],
      transactionId: id = 0,
    } = antifraudReq;

    if (!id) return;

    const transaction = await this.transactionRepository
    .findOne({
      where: {
        id,
      },
    });
    
    let transactionStatusId = TransactionStatus.APPROVED;
    for (const feature of antifraudFeatures) {
      const code = feature.code;
      const isValid = this.runFeatureEngine(code, transaction);
      if (!isValid) transactionStatusId = TransactionStatus.REJECTED;
    }
    await this.transactionRepository
      .update({
        id,
    }, {
        transactionStatusId,
    });
  }

  runFeatureEngine(code: string, transaction: Transaction): boolean {
    return Feature[code](transaction);
  }
}
