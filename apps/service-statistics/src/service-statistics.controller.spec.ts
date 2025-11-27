import { Test, TestingModule } from '@nestjs/testing';
import { ServiceStatisticsController } from './service-statistics.controller';
import { ServiceStatisticsService } from './service-statistics.service';

describe('ServiceStatisticsController', () => {
  let serviceStatisticsController: ServiceStatisticsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceStatisticsController],
      providers: [ServiceStatisticsService],
    }).compile();

    serviceStatisticsController = app.get<ServiceStatisticsController>(ServiceStatisticsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceStatisticsController.getHello()).toBe('Hello World!');
    });
  });
});
