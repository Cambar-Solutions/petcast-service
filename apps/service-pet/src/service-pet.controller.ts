import { Controller, Get } from '@nestjs/common';
import { ServicePetService } from './service-pet.service';

@Controller()
export class ServicePetController {
  constructor(private readonly servicePetService: ServicePetService) {}

  @Get()
  getHello(): string {
    return this.servicePetService.getHello();
  }
}
