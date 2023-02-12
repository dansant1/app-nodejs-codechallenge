import { 
  Controller,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext, EventPattern } from '@nestjs/microservices';
import { TransactionServiceService } from './transaction-service.service';
import {
  KafkaExceptionFilter,
  KafkaValidationPipe,
  EVENT_CREATE_TRANSACTION_REQUEST,
  EVENT_UPDATE_TRANSACTION_STATUS_REQUEST,
} from '../../@shared';
import {
  CreateTransactionReq,
  AntifraudFeaturesDTO,
  AntifraudReq,
} from './dto';

@Controller()
export class TransactionServiceController {
  constructor(
    private readonly transactionServiceService: TransactionServiceService,
  ) {}

  @MessagePattern(EVENT_CREATE_TRANSACTION_REQUEST)
  @UsePipes(new KafkaValidationPipe())
  @UseFilters(new KafkaExceptionFilter())
  async create(
    @Payload() message: CreateTransactionReq,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    return this.transactionServiceService
    .create(message);
  }

  @EventPattern(EVENT_UPDATE_TRANSACTION_STATUS_REQUEST)
  @UsePipes(new KafkaValidationPipe())
  @UseFilters(new KafkaExceptionFilter())
  async updateTransactionStatus(
    @Payload() message: AntifraudReq,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    void this.transactionServiceService
    .updateTransactionStatusByAntifraudFeature(message);
  }
}
