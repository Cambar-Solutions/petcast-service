import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicePetController } from './service-pet.controller';
import { ServicePetService } from './service-pet.service';
import { PetsModule } from './pets/pets.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { RemindersModule } from './reminders/reminders.module';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    PetsModule,
    MedicalRecordsModule,
    RemindersModule,
  ],
  controllers: [ServicePetController],
  providers: [ServicePetService],
})
export class ServicePetModule {}
