import { Controller, Get } from '@nestjs/common';
import { AntifraudEngineServiceService } from './antifraud-engine-service.service';

@Controller()
export class AntifraudEngineServiceController {
  constructor(private readonly antifraudEngineServiceService: AntifraudEngineServiceService) {}

  @Get()
  getHello(): string {
    return this.antifraudEngineServiceService.getHello();
  }
}
