import { Controller, Get } from '@nestjs/common';
import { ServiceUserService } from './service-user.service';

@Controller()
export class ServiceUserController {
  constructor(private readonly serviceUserService: ServiceUserService) {}

  @Get()
  getHello(): string {
    return this.serviceUserService.getHello();
  }
}
