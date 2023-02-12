import { Module } from '@nestjs/common';
import { AntifraudEngineServiceController } from './antifraud-engine-service.controller';
import { AntifraudEngineServiceService } from './antifraud-engine-service.service';

@Module({
  imports: [],
  controllers: [AntifraudEngineServiceController],
  providers: [AntifraudEngineServiceService],
})
export class AntifraudEngineServiceModule {}
