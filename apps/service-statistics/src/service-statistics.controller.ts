import { Controller, Get } from '@nestjs/common';
import { ServiceStatisticsService } from './service-statistics.service';

@Controller()
export class ServiceStatisticsController {
  constructor(private readonly serviceStatisticsService: ServiceStatisticsService) {}

  @Get()
  getHello(): string {
    return this.serviceStatisticsService.getHello();
  }
}
