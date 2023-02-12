import { 
  Controller,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { TransactionServiceService } from './transaction-service.service';
import {
  KafkaExceptionFilter,
  EVENT_CREATE_TRANSACTION_REQUEST,
  KafkaValidationPipe,
} from '../../@shared';
import {
  CreateTransactionMessage
} from './dto';

@Controller()
export class TransactionServiceController {
  constructor(
    private readonly transactionServiceService: TransactionServiceService
  ) {}

  @MessagePattern(EVENT_CREATE_TRANSACTION_REQUEST)
  @UsePipes(new KafkaValidationPipe())
  @UseFilters(new KafkaExceptionFilter())
  async create(
    @Payload() message: CreateTransactionMessage,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    return this.transactionServiceService.create(message);
  }
}
