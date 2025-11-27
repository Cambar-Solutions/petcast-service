import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceStatisticsService {
  getHello(): string {
    return 'Hello World!';
  }
}
