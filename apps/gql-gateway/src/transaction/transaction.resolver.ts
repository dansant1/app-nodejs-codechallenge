import {
  Resolver,
  Mutation,
  Query,
  Args,
} from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import {
  Transaction,
  CreateTransactionReq,
  TransactionRes,
  TransactionListRes,
} from './dto/base.dto';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionListRes, {
    description: 'Obtiene la lista de transacciones',
  })
  async get(): Promise<TransactionListRes> {
    return {
      transactions: [],
    }
  }

  @Mutation(() => TransactionRes, {
    description: 'Procesa un transacción.',
  })
  async create(
    @Args() args: CreateTransactionReq
  ): Promise<TransactionRes> {
    const response = await this.transactionService.create(args);
    return response;
  }
}
