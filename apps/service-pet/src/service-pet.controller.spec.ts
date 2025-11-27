import { Test, TestingModule } from '@nestjs/testing';
import { ServicePetController } from './service-pet.controller';
import { ServicePetService } from './service-pet.service';

describe('ServicePetController', () => {
  let servicePetController: ServicePetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServicePetController],
      providers: [ServicePetService],
    }).compile();

    servicePetController = app.get<ServicePetController>(ServicePetController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(servicePetController.getHello()).toBe('Hello World!');
    });
  });
});
