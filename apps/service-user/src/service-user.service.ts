import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
