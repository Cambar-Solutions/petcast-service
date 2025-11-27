import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceStatisticsController } from './service-statistics.controller';
import { ServiceStatisticsService } from './service-statistics.service';
import { StatisticsModule } from './statistics/statistics.module';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    StatisticsModule,
  ],
  controllers: [ServiceStatisticsController],
  providers: [ServiceStatisticsService],
})
export class ServiceStatisticsModule {}
