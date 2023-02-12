import { IsObject, IsNumber, IsString,  } from 'class-validator';
import {
  Expose,
  Type,
} from 'class-transformer';

interface IncomingMessage {
  topic: string;
  partition: number;
  timestamp: string;
  magicByte: number;
  attributes: number;
  offset: string;
  key: any;
  value: any;
  headers: Record<string, any>;
}

export interface CommunicationEventHeader {
  mvno_id?: number;
  endpoint?: string;
  msisdn?: string;
  email?: string;
  priority?: 'HIGH' | 'MID' | 'LOW';
  allowedChannels?: any;
}

export class CreateTransactionReq  {
  @IsString()
  readonly accountExternalIdDebit: string;

  @IsString()
  readonly accountExternalIdCredit: string;

  @IsNumber()
  readonly tranferTypeId: number;

  @IsNumber()
  readonly value: number;
}


export class CreateTransactionMessage  {
  @Expose()
  @Type(() => CreateTransactionReq)
  value: CreateTransactionReq;

}