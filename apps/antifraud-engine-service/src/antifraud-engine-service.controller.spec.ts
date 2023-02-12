import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudEngineServiceController } from './antifraud-engine-service.controller';
import { AntifraudEngineServiceService } from './antifraud-engine-service.service';

describe('AntifraudEngineServiceController', () => {
  let antifraudEngineServiceController: AntifraudEngineServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntifraudEngineServiceController],
      providers: [AntifraudEngineServiceService],
    }).compile();

    antifraudEngineServiceController = app.get<AntifraudEngineServiceController>(AntifraudEngineServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(antifraudEngineServiceController.getHello()).toBe('Hello World!');
    });
  });
});
