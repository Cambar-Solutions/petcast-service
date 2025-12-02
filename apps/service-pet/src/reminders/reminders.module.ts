import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { ReminderProcessorService } from './reminder-processor.service';
import { Recordatorio } from '../entities/recordatorio.entity';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recordatorio]),
    ScheduleModule.forRoot(),
    forwardRef(() => WhatsappModule),
  ],
  controllers: [RemindersController],
  providers: [RemindersService, ReminderProcessorService],
  exports: [RemindersService, ReminderProcessorService],
})
export class RemindersModule {}
