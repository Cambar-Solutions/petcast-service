import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAppointmentController } from './service-appointment.controller';
import { ServiceAppointmentService } from './service-appointment.service';

describe('ServiceAppointmentController', () => {
  let serviceAppointmentController: ServiceAppointmentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAppointmentController],
      providers: [ServiceAppointmentService],
    }).compile();

    serviceAppointmentController = app.get<ServiceAppointmentController>(ServiceAppointmentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceAppointmentController.getHello()).toBe('Hello World!');
    });
  });
});
