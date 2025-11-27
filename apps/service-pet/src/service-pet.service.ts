import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicePetService {
  getHello(): string {
    return 'Hello World!';
  }
}
