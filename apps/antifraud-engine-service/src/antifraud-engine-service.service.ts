import { Injectable } from '@nestjs/common';

@Injectable()
export class AntifraudEngineServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
